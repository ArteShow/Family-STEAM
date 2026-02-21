FROM golang:1.24-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o file-service ./cmd/file-service/main.go

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/file-service .

EXPOSE 8003
CMD ["./file-service"]