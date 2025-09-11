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
docker compose up -d --profile initdb # -- profile initdb only for the first time, to setup the db
```
Let 1 minute to the db to setup and fill up

#### Shutdown the service
Either reboot your system, or `docker compose down`

If you want to factory reset the db, use `docker compose down -v`, uncomment the previous, do a docker compose up, and re-comment

## Ports
### DB - 5430
### Client only - 4240
### Server only - 4242
### Integration - 80
