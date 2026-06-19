package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ArteShow/Family-STEAM/services/message-service/internal/handlers"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/message-service/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/message-service/adminSend", handlers.AdminSendHandler)
	mux.HandleFunc("/message-service/adminInbox", handlers.AdminInboxHandler)
	mux.HandleFunc("/message-service/adminThread", handlers.AdminThreadHandler)
	mux.HandleFunc("/message-service/adminDelete", handlers.AdminDeleteHandler)
	mux.HandleFunc("/message-service/userReply", handlers.UserReplyHandler)
	mux.HandleFunc("/message-service/userInbox", handlers.UserInboxHandler)
	mux.HandleFunc("/message-service/userThread", handlers.UserThreadHandler)
	mux.HandleFunc("/message-service/markRead", handlers.MarkReadHandler)

	port := os.Getenv("MESSAGE_SERVICE_PORT")
	if port == "" {
		port = "8007"
	}

	log.Printf("Message service running on port %s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal("Failed to start message service:", err)
	}
}
