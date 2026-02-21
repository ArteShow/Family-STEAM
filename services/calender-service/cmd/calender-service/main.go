package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ArteShow/Family-STEAM/services/calender-service/internal/config"
	"github.com/ArteShow/Family-STEAM/services/calender-service/internal/handlers"
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
	mux.HandleFunc("/calender-service/health", func(w http.ResponseWriter, _ *http.Request) {
		_, err = w.Write([]byte("ok"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})
	mux.HandleFunc("/calender-service/create", handlers.CreateCalenderEntryHandler)
	mux.HandleFunc("/calender-service/delete", handlers.DeleteCalenderEntryHandler)
	mux.HandleFunc("/calender-service/getAll", handlers.GetAllCalenderEntriesHandler)
	mux.HandleFunc("/calender-service/get", handlers.GetCalenderEntryByIDHandler)
	mux.HandleFunc("/calender-service/update-images", handlers.UpdateCalenderEntryImagesHandler)

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
		log.Println("server running on :8005")
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