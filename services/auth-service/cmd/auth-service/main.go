package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/handlers"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/auth-service/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/auth-service/register", handlers.RegisterHandler)
	mux.HandleFunc("/auth-service/user-register", handlers.RegisterHandler)
	mux.HandleFunc("/auth-service/login", handlers.LoginHandler)
	mux.HandleFunc("/auth-service/verify", handlers.VerifyHandler)
	mux.HandleFunc("/auth/register", handlers.RegisterHandler)
	mux.HandleFunc("/auth/user-register", handlers.RegisterHandler)
	mux.HandleFunc("/auth/login", handlers.LoginHandler)
	mux.HandleFunc("/auth/verify", handlers.VerifyHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8001"
	}

	srv := &http.Server{Addr: ":" + port, Handler: mux}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		log.Printf("Auth service running on port %s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Failed to start auth service:", err)
		}
	}()

	<-ctx.Done()

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("Auth service shutdown failed: %v", err)
	}
}
