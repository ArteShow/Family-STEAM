FROM golang:1.24-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o calender-service ./cmd/calender-service/main.go

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/calender-service .

EXPOSE 8001
CMD ["./calender-service"]