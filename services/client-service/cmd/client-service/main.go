package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ArteShow/Family-STEAM/services/client-service/internal/handlers"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/client-service/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/client-service/create", handlers.CreateClientHandler)
	mux.HandleFunc("/client-service/delete", handlers.DeleteClientHandler)
	mux.HandleFunc("/client-service/get", handlers.GetClientHandler)
	mux.HandleFunc("/client-service/update", handlers.UpdateClientHandler)
	mux.HandleFunc("/client-service/list", handlers.ListClientHandler)

	port := os.Getenv("CLIENT_SERVICE_PORT")
	if port == "" {
		port = "8004"
	}

	log.Printf("Client service running on port %s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal("Failed to start client service:", err)
	}
}
