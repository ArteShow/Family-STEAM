# Family STEAM

Family STEAM is a Go-based microservice application with a static frontend, an API gateway, service-specific backends, PostgreSQL storage, and host-managed NGINX for web routing.

## Architecture

- Frontend: static HTML, CSS, and JavaScript under `frontend/public`
- API Gateway: `services/api-gateway`
- Auth Service: `services/auth-service`
- User Service: `services/user-service` (gRPC)
- Calendar Service: `services/calendar-service`
- Client Service: `services/client-service`
- File Service: `services/file-service`
- Message Service: `services/message-service`
- Newsletter Service: `services/newsletter-service`
- Review Service: `services/review-service`
- Ticket Service: `services/ticket-service`
- Database: PostgreSQL with migrations from `migrations/`

## Requirements

- Go 1.26 or newer for local builds
- Docker and Docker Compose for container deployment
- PostgreSQL for persistent storage
- Host-installed NGINX using `familysteam.conf`

## Local Build

Build each service from its module directory:

```bash
cd services/api-gateway && go build ./...
cd services/auth-service && go build ./...
cd services/calendar-service && go build ./...
cd services/client-service && go build ./...
cd services/file-service && go build ./...
cd services/message-service && go build ./...
cd services/newsletter-service && go build ./...
cd services/review-service && go build ./...
cd services/ticket-service && go build ./...
cd services/user-service && go build ./...
```

## Docker Deployment

Use the provided environment file:

```bash
docker compose --env-file config/docker.env up -d --build
```

## Ports

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

## Configuration

The main runtime settings live in `config/docker.env`.

Important values include:

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

## NGINX

NGINX is not containerized. It should proxy host traffic to the frontend and API gateway using `familysteam.conf`.

See `NGINX_SETUP.md` for the host-side proxy layout.
