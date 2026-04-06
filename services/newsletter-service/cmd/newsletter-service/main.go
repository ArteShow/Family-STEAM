package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/config"
	"github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/handlers"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	if cfg.Port != "" && cfg.Port[0] != ':' {
		cfg.Port = ":" + cfg.Port
	}

	mux := http.NewServeMux()

	// Public endpoints
	mux.HandleFunc("/newsletter-service/subscribe", handlers.SubscribeHandler)
	mux.HandleFunc("/newsletter-service/unsubscribe", handlers.UnsubscribeHandler)

	// Admin-only endpoints (enforced at the gateway)
	mux.HandleFunc("/newsletter-service/subscribers", handlers.SubscribersHandler)
	mux.HandleFunc("/newsletter-service/send", handlers.SendHandler(cfg))
	mux.HandleFunc("/newsletter-service/campaigns", handlers.CampaignsHandler)

	// Health check
	mux.HandleFunc("/newsletter-service/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		if _, err = w.Write([]byte(`{"status":"ok"}`)); err != nil {
			log.Printf("health write error: %v", err)
		}
	})

	addr := cfg.Port
	fmt.Printf("newsletter-service listening on %s\n", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
