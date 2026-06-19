package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/config"
	"github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/handlers"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/newsletter-service/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/newsletter-service/subscribe", handlers.SubscribeHandler)
	mux.HandleFunc("/newsletter-service/unsubscribe", handlers.UnsubscribeHandler)
	mux.HandleFunc("/newsletter-service/subscribers", handlers.SubscribersHandler)
	mux.HandleFunc("/newsletter-service/send", handlers.SendHandler(cfg))
	mux.HandleFunc("/newsletter-service/campaigns", handlers.CampaignsHandler)

	port := os.Getenv("NEWSLETTER_SERVICE_PORT")
	if port == "" {
		port = "8008"
	}

	log.Printf("Newsletter service running on port %s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal("Failed to start newsletter service:", err)
	}
}
