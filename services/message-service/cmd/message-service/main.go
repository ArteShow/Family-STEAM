package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/message-service/internal/config"
	"github.com/ArteShow/Family-STEAM/services/message-service/internal/handlers"
)

func main() {
	cfg, err := config.Read()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	if cfg.Port != "" && cfg.Port[0] != ':' {
		cfg.Port = ":" + cfg.Port
	}

	mux := http.NewServeMux()

	// Admin endpoints (protected by AdminOnly middleware at the gateway level)
	mux.HandleFunc("/message-service/adminSend", handlers.AdminSendHandler)
	mux.HandleFunc("/message-service/adminInbox", handlers.AdminInboxHandler)
	mux.HandleFunc("/message-service/adminThread", handlers.AdminThreadHandler)
	mux.HandleFunc("/message-service/adminDelete", handlers.AdminDeleteHandler)

	// User endpoints (protected by UserAuth middleware at the gateway level)
	mux.HandleFunc("/message-service/userReply", handlers.UserReplyHandler)
	mux.HandleFunc("/message-service/userInbox", handlers.UserInboxHandler)
	mux.HandleFunc("/message-service/userThread", handlers.UserThreadHandler)
	mux.HandleFunc("/message-service/markRead", handlers.MarkReadHandler)

	// Health check
	mux.HandleFunc("/message-service/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		if _, err = w.Write([]byte(`{"status":"ok"}`)); err != nil {
			log.Printf("health write error: %v", err)
		}
	})

	addr := cfg.Port
	fmt.Printf("message-service listening on %s\n", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
