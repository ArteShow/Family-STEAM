package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ArteShow/Family-STEAM/services/review-service/internal/config"
	"github.com/ArteShow/Family-STEAM/services/review-service/internal/handlers"
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
	mux.HandleFunc("/review-service/health", func(w http.ResponseWriter, _ *http.Request) {
		_, err = w.Write([]byte("ok"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})
	mux.HandleFunc("/review-service/create", handlers.CreateReviewHandler)
	mux.HandleFunc("/review-service/adminCreate", handlers.AdminCreateReviewHandler)
	mux.HandleFunc("/review-service/getByCalendar", handlers.GetByCalendarHandler)
	mux.HandleFunc("/review-service/delete", handlers.DeleteReviewHandler)
	mux.HandleFunc("/review-service/checkEligible", handlers.CheckEligibleHandler)

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
		log.Println("review-service running on " + cfg.Port)
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
