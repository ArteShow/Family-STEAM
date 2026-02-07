FROM golang:1.24-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o camp-service ./cmd/camp-service/main.go

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/camp-service .

EXPOSE 8004
CMD ["./camp-service"]