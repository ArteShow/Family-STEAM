FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o ticket-service ./cmd/ticket-service/main.go

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/ticket-service .

EXPOSE 8080

CMD ["./ticket-service"]