FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o newsletter-service ./cmd/newsletter-service/main.go

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/newsletter-service .
EXPOSE 8008
CMD ["./newsletter-service"]
