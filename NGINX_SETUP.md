# NGINX Setup

NGINX is installed on the host machine and is not part of the Docker deployment.

## Purpose

- Serve the frontend site
- Proxy API requests to the Go API gateway
- Optionally terminate TLS on the host

## Proxy Targets

- Frontend: `http://127.0.0.1:80`
- API Gateway: `http://127.0.0.1:8000`

## Example Behavior

- `https://your-domain/` -> frontend
- `https://your-domain/api/` -> API gateway

## Operational Notes

1. Keep the host configuration in `familysteam.conf`.
2. Do not create an NGINX container.
3. Reload NGINX after editing the config.
4. Make sure the upstream ports match `config/docker.env`.

## Example Proxy Blocks

```nginx
location / {
    proxy_pass http://127.0.0.1:80;
}

location /api/ {
    proxy_pass http://127.0.0.1:8000;
}
```

## Troubleshooting

- If the site loads blank, verify the frontend container is running.
- If API calls fail, verify the gateway container is reachable on port `8000`.
- If HTTPS calls are blocked, check that the browser is not mixing secure and insecure origins.
