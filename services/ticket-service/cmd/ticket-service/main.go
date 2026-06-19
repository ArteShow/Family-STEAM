package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ArteShow/Family-STEAM/services/ticket-service/internal/handlers"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/ticket-service/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/ticket-service/create", handlers.CreateTicketHandler)
	mux.HandleFunc("/ticket-service/getAll", handlers.GetAllTicketsHandler)
	mux.HandleFunc("/ticket-service/getByEmail", handlers.GetByEmailHandler)
	mux.HandleFunc("/ticket-service/getByUser", handlers.GetByUserHandler)
	mux.HandleFunc("/ticket-service/respond", handlers.RespondHandler)
	mux.HandleFunc("/ticket-service/close", handlers.CloseTicketHandler)
	mux.HandleFunc("/ticket-service/delete", handlers.DeleteTicketHandler)

	port := os.Getenv("TICKET_SERVICE_PORT")
	if port == "" {
		port = "8006"
	}

	log.Printf("Ticket service running on port %s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal("Failed to start ticket service:", err)
	}
}
