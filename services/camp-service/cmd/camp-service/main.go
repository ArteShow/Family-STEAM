package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ArteShow/Family-STEAM/services/camp-service/internal/config"
	camp "github.com/ArteShow/Family-STEAM/services/camp-service/internal/handlers/camp"
	client "github.com/ArteShow/Family-STEAM/services/camp-service/internal/handlers/client"
	"github.com/ArteShow/Family-STEAM/services/camp-service/internal/middleware"
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

	mux := http.NewServeMux()
	mux.HandleFunc("/camp-service/health", func(w http.ResponseWriter, _ *http.Request) {
		_, err = w.Write([]byte("ok"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})
	mux.Handle("/camp-service/camp/create", middleware.AdminCheckMiddleware(camp.CreatCamp))
	mux.Handle("/camp-service/camp/delete", middleware.AdminCheckMiddleware(camp.DeleteCamp))
	mux.Handle("/camp-service/camp/get_all", middleware.AdminCheckMiddleware(camp.GetAllCamps))
	mux.Handle("/camp-service/camp/get_by_id", middleware.AdminCheckMiddleware(camp.GetCampByID))

	mux.Handle("/camp-service/client/create", middleware.AdminCheckMiddleware(client.CreatClient))
	mux.Handle("/camp-service/client/delete", middleware.AdminCheckMiddleware(client.DeleteClient))
	mux.Handle("/camp-service/client/get_all", middleware.AdminCheckMiddleware(client.GetAllClients))
	mux.Handle("/camp-service/client/get_by_id", middleware.AdminCheckMiddleware(client.GetClientById))

	srv := &http.Server{
		Addr:         cfg.Port,
		Handler:      mux,
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
		log.Println("server running on :8004")
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