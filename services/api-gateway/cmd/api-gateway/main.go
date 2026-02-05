package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ArteShow/Family-STEAM/services/api-gateway/internal/config"
	"github.com/ArteShow/Family-STEAM/services/api-gateway/internal/middleware"
	"github.com/ArteShow/Family-STEAM/services/api-gateway/internal/proxy"
)

const (
	readTimeout  = 10 * time.Second
	writeTimeout = 10 * time.Second
	idleTimeou   = 60 * time.Second
)

func main() {
	cfg, err := config.Read()
	if err != nil {
		log.Fatal(err)
	}

	if cfg.Port != "" && cfg.Port[0] != ':' {
		cfg.Port = ":" + cfg.Port
	}

	registerProxy := proxy.NewProxy("http://auth-service:8003", "/auth-service/register")
	loginProxy := proxy.NewProxy("http://auth-service:8003", "/auth-service/login")

	createProxy := proxy.NewProxy("http://calender-service:8001", "/calender-service/create")
	deleteProxy := proxy.NewProxy("http://calender-service:8001", "/calender-service/delete")
	getAllProxy := proxy.NewProxy("http://calender-service:8001", "/calender-service/get_all")
	getByIDProxy := proxy.NewProxy("http://calender-service:8001", "/calender-service/get_by_id")
	updateProxy := proxy.NewProxy("http://calender-service:8001", "/calender-service/update")

	handler := http.NewServeMux()
	handler.Handle(
		"/api/v1/api-gateway/health",
		middleware.LogMiddleware(
			http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
				_, err := w.Write([]byte("ok"))
				if err != nil {
					http.Error(w, "failed to write status ok", http.StatusInternalServerError)
				}
			}),
		),
	)
	handler.Handle("/api/v1/auth/register", middleware.LogMiddleware(registerProxy))
	handler.Handle("/api/v1/auth/login", middleware.LogMiddleware(loginProxy))

	handler.Handle("/api/v1/calender/create", middleware.LogMiddleware(middleware.AuthMiddleware()(createProxy)))
	handler.Handle("/api/v1/calender/delete", middleware.LogMiddleware(middleware.AuthMiddleware()(deleteProxy)))
	handler.Handle("/api/v1/calender/get_all", middleware.LogMiddleware(middleware.AuthMiddleware()(getAllProxy)))
	handler.Handle("/api/v1/calender/get_by_id", middleware.LogMiddleware(middleware.AuthMiddleware()(getByIDProxy)))
	handler.Handle("/api/v1/calender/update", middleware.LogMiddleware(middleware.AuthMiddleware()(updateProxy)))

	srv := &http.Server{
		Addr:         cfg.Port,
		Handler:      handler,
		ReadTimeout:  readTimeout,
		WriteTimeout: writeTimeout,
		IdleTimeout:  idleTimeou,
	}

	ctx, stop := signal.NotifyContext(
		context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
	)
	defer stop()

	go func() {
		log.Println("gateway running on " + cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	<-ctx.Done()

	log.Println("graceful shutdown started")

	shutdownCtx, cancel := context.WithTimeout(
		context.Background(),
		10*time.Second,
	)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("shutdown failed: %v", err)
	}

	log.Println("shutdown complete")
}
