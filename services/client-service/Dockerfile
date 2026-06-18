FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o client-service ./cmd/client-service/main.go

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/client-service .

EXPOSE 8080

CMD ["./client-service"]