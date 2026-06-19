# Admin Manual

## Configuration

Primary runtime settings live in `config/docker.env`.

Important values:

- `API_GATEWAY_PORT`
- `AUTH_SERVICE_PORT`
- `USER_SERVICE_GRPC_PORT`
- `FILE_SERVICE_PORT`
- `CLIENT_SERVICE_PORT`
- `CALENDAR_SERVICE_PORT`
- `TICKET_SERVICE_PORT`
- `MESSAGE_SERVICE_PORT`
- `NEWSLETTER_SERVICE_PORT`
- `REVIEW_SERVICE_PORT`
- `JWT_SECRET`
- `POSTGRES_*`
- `SMTP_*`
- `ADMIN_USERNAMES`

## Service Management

Local Docker deployment:

```bash
docker compose --env-file config/docker.env up -d --build
```

Stop the stack:

```bash
docker compose --env-file config/docker.env down
```

View logs:

```bash
docker compose logs -f api-gateway
docker compose logs -f auth-service
docker compose logs -f user-service
```

## Database Setup

1. Start PostgreSQL.
2. Ensure the `migrations/` directory is mounted or executed during initialization.
3. Confirm the schema exists before enabling traffic.
4. Verify the `users` table and the service-specific tables after migration.

## Backups

1. Export the database regularly with `pg_dump`.
2. Store backups outside the Docker volume.
3. Test restore procedures on a non-production database.
4. Keep a copy of `config/docker.env` with backup metadata.

## Updates

1. Pull the latest repository changes.
2. Review `docker-compose.yaml`, service Dockerfiles, and the env file.
3. Rebuild images with `docker compose --env-file config/docker.env up -d --build`.
4. Validate the gateway and auth flow before exposing traffic.

## Troubleshooting

- If a service does not start, check its logs first.
- If a route returns `405`, confirm the gateway proxy path and the service route prefix match.
- If authentication fails, confirm `JWT_SECRET` is identical in the gateway and auth service.
- If the user service is unreachable, verify gRPC port `50002` and DNS name `user-service` inside the Docker network.
- If PostgreSQL fails, confirm the volume permissions and that the migration scripts are valid SQL.
