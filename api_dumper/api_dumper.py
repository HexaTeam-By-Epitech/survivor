#!/usr/bin/env python3
import os
import requests
import psycopg2
from pathlib import Path
from datetime import datetime
import dotenv
import time

dotenv.load_dotenv(dotenv.find_dotenv())

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 5432))

# --- Config ---
API_BASE_URL = "https://api.jeb-incubator.com"  # <-- adapte
APIKEY = os.getenv("API_KEY")
if not APIKEY:
    raise RuntimeError("Erreur: définis ta clé d’API dans APIKEY")

OUTDIR = Path("dump")
IMGDIR = OUTDIR / "images"
OUTDIR.mkdir(exist_ok=True)
IMGDIR.mkdir(exist_ok=True)

HEADERS = {"X-Group-Authorization": APIKEY, "Accept": "application/json"}

# --- PostgreSQL ---
conn = psycopg2.connect(
    dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT
)
cur = conn.cursor()


# --- Utils ---
def fetch_list(endpoint: str, limit: int = 100):
    results = []
    skip = 0
    while True:
        r = requests.get(
            f"{API_BASE_URL}/{endpoint}",
            params={"skip": skip, "limit": limit},
            headers=HEADERS,
            timeout=20,
        )
        if r.status_code == 429:
            print("[WARN] Trop de requêtes, pause 5 secondes...")
            time.sleep(5)
            continue
        print(f"[INFO] Fetching {endpoint}, skip={skip}, current total={len(results)}")
        print(f"[DEBUG] URL: {r.url}, response : {r.content}")
        r.raise_for_status()
        page = r.json()
        if not page:
            break
        results.extend(page)
        skip += limit
        time.sleep(0.1)  # petite pause pour limiter le rythme
    return results


def fetch_item(endpoint: str, item_id: int):
    r = requests.get(
        f"{API_BASE_URL}/{endpoint}/{item_id}", headers=HEADERS, timeout=20
    )
    r.raise_for_status()
    return r.json()


def fetch_image(endpoint: str, item_id: int, filename: str):
    r = requests.get(
        f"{API_BASE_URL}/{endpoint}/{item_id}/image", headers=HEADERS, timeout=20
    )
    if r.status_code == 200 and r.content:
        path = IMGDIR / filename
        with open(path, "wb") as f:
            f.write(r.content)
        return str(path)
    return None


def insert_account(name, email, image_path=None):
    cur.execute(
        """
        INSERT INTO "Accounts" (name, email, image_path, password, created_at, last_updated_at)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """,
        (
            name,
            email,
            image_path,
            "changeme",  # placeholder
            datetime.now(),
            datetime.now(),
        ),
    )
    return cur.fetchone()[0]


# Global variable to store startup mapping
startup_id_mapping = {}


# --- Import logique ---
def import_users():
    users = requests.get(f"{API_BASE_URL}/users", headers=HEADERS, timeout=20).json()
    for u in users:
        details = fetch_item("users", u["id"])
        image_path = fetch_image("users", u["id"], f"user_{u['id']}.jpg")

        account_id = insert_account(
            details.get("name"), details.get("email"), image_path
        )

        cur.execute(
            """INSERT INTO "Users" (account_id) VALUES (%s) RETURNING id""",
            (account_id,),
        )
        user_id = cur.fetchone()[0]

        role = (details.get("role") or "").lower()
        if role == "founder":
            # Try to find the startup this founder belongs to
            startup_db_id = get_founder_startup_id(details, u["id"])
            cur.execute(
                """INSERT INTO "Founders" (user_id) VALUES (%s) RETURNING id""",
                (user_id,),
            )
            founder_id = cur.fetchone()[0]
            cur.execute(
                """INSERT INTO "StartupsFounders" (founder_id, startup_id) VALUES (%s, %s)""",
                (founder_id, startup_db_id),
            )
        elif role == "investor":
            cur.execute("""INSERT INTO "Investors" (user_id) VALUES (%s)""", (user_id,))
        elif role == "admin":
            cur.execute("""INSERT INTO "Admins" (user_id) VALUES (%s)""", (user_id,))
        else:
            print(f"[WARN] Role inconnu: {role}")


def get_founder_startup_id(user_details, user_api_id):
    """Determine which startup this founder belongs to"""
    # If the user details contain startup information, use it
    if "startup_id" in user_details and user_details["startup_id"]:
        api_startup_id = user_details["startup_id"]
        if api_startup_id in startup_id_mapping:
            return startup_id_mapping[api_startup_id]

    # If we have startup info in the user details (like company name)
    if "company" in user_details or "startup_name" in user_details:
        company_name = user_details.get("company") or user_details.get("startup_name")
        if company_name:
            # Find startup by company name
            cur.execute(
                """
                SELECT s.id FROM "Startups" s 
                JOIN "Companies" c ON s.company_id = c.id 
                WHERE c.name ILIKE %s
            """,
                (f"%{company_name}%",),
            )
            result = cur.fetchone()
            if result:
                return result[0]

    # Default to first startup if no specific association found
    if startup_id_mapping:
        return list(startup_id_mapping.values())[0]

    # If no startups exist yet, return 1 as fallback
    return 1


def import_startups():
    startups = fetch_list("startups")
    for s in startups:
        acc_id = insert_account(s.get("name"), f"{s['name'].lower()}@example.com")
        cur.execute(
            """INSERT INTO "Companies" (account_id, name) VALUES (%s, %s) RETURNING id""",
            (acc_id, s["name"]),
        )
        company_id = cur.fetchone()[0]

        cur.execute(
            """INSERT INTO "Startups" (company_id, website_url) VALUES (%s, %s) RETURNING id""",
            (company_id, s.get("website_url")),
        )
        startup_db_id = cur.fetchone()[0]

        # Store mapping between API startup ID and database startup ID
        startup_id_mapping[s["id"]] = startup_db_id
        print(f"[INFO] Mapped startup API ID {s['id']} to DB ID {startup_db_id}")


def import_partners():
    partners = fetch_list("partners")
    for p in partners:
        acc_id = insert_account(p.get("name"), f"{p['name'].lower()}@example.com")
        cur.execute(
            """INSERT INTO "Companies" (account_id, name, legal_status_id, address, phone_number, description)
                       VALUES (%s, %s, NULL, %s, %s, %s) RETURNING id""",
            (acc_id, p["name"], p.get("address"), p.get("phone"), p.get("description")),
        )
        company_id = cur.fetchone()[0]

        cur.execute(
            """INSERT INTO "Partners" (company_id, partnership_type_id) VALUES (%s, NULL)""",
            (company_id,),
        )


def import_news():
    news = fetch_list("news")
    for n in news:
        # Map startup_id to real company_id if available
        company_id = 1  # default fallback
        if "startup_id" in n and n["startup_id"] in startup_id_mapping:
            startup_db_id = startup_id_mapping[n["startup_id"]]
            # Get the company_id for this startup
            cur.execute(
                """SELECT company_id FROM "Startups" WHERE id = %s""", (startup_db_id,)
            )
            result = cur.fetchone()
            if result:
                company_id = result[0]

        cur.execute(
            """INSERT INTO "News" (title, location, description, company_id)
                       VALUES (%s, %s, %s, %s)""",
            (n["title"], n.get("location"), n.get("description", ""), company_id),
        )
        fetch_image("news", n["id"], f"news_{n['id']}.jpg")


# --- Run ---
if __name__ == "__main__":
    print("Import startups...")
    import_startups()

    print("Import users...")
    import_users()

    print("Import partners...")
    import_partners()

    print("Import news...")
    import_news()

    conn.commit()
    cur.close()
    conn.close()
    print("✅ Import terminé")
