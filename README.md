## Startup project

#### Env files

api_dumper/.env ->
```
API_KEY={your_JEB_token}
```
/.env ->
```
BASE_POSTGRES_PASSWORD={a_password}
```

#### Run the service
```
docker compose build --no-cache
docker compose up -d
```
Let 1 minute to the db to setup and fill up

#### Shutdown the service
Either reboot your system, or `docker compose down`

#### Database setup
By default, a service "initdb" is run **each time** (due to docker compose's profiles behavior)
After the first docker compose up, comment out this part:
```
#initdb:
#   build:
#     context: .
#     dockerfile: ./docker/Dockerfile.initdb
#   container_name: survivor-initdb
#   environment:
#     BASE_POSTGRES_PASSWORD: ${BASE_POSTGRES_PASSWORD}
#   depends_on:
#     - db
#   networks:
#     - survivor-app
#   volumes:
#     - shared-config:/initdb/shared
#   restart: "no"
```
and the dependant
```
services:
  ---
  server:
    ---
    depends_on:
#     - initdb
```

If you want to factory reset the db, use `docker compose down -v`, uncomment the previous, do a docker compose up, and re-comment

## Ports
### Client only - 4240
### Server only - 4242
### Both - 80
