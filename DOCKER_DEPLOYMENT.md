# Docker Deployment

## Overview

The project is designed to run with one container per service plus one PostgreSQL container. NGINX is not containerized and must be managed on the host.

## Build and Start

```bash
docker compose --env-file config/docker.env up -d --build
```

## Service Ports

- Frontend: `80`
- API Gateway: `8000`
- Auth Service: `8001`
- File Service: `8003`
- Client Service: `8004`
- Calendar Service: `8005`
- Ticket Service: `8006`
- Message Service: `8007`
- Newsletter Service: `8008`
- Review Service: `8009`
- User Service gRPC: `50002`
- PostgreSQL: `5432`

## Environment File

Use `config/docker.env` to control the deployment values. Do not hardcode production secrets into the images.

## Persistent Storage

- PostgreSQL data is stored in the named volume `postgres_data`.
- Database migrations are mounted from `migrations/` into the PostgreSQL initialization path.

## Host NGINX

NGINX should proxy host traffic to the frontend and API gateway using the host-level `familysteam.conf` file.

Recommended layout:

- `/` -> frontend on `localhost:80`
- `/api/` -> API gateway on `localhost:8000`

## Verification

After startup, confirm the stack with:

```bash
docker compose --env-file config/docker.env ps
```

Then check logs for the gateway, auth service, and user service if any request fails.
