FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod tidy && \
    CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o message-service ./cmd/message-service/main.go

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/message-service .
EXPOSE 8007
CMD ["./message-service"]
