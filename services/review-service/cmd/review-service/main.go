package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ArteShow/Family-STEAM/services/review-service/internal/handlers"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/review-service/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/review-service/create", handlers.CreateReviewHandler)
	mux.HandleFunc("/review-service/adminCreate", handlers.AdminCreateReviewHandler)
	mux.HandleFunc("/review-service/getByCalendar", handlers.GetByCalendarHandler)
	mux.HandleFunc("/review-service/delete", handlers.DeleteReviewHandler)
	mux.HandleFunc("/review-service/checkEligible", handlers.CheckEligibleHandler)

	port := os.Getenv("REVIEW_SERVICE_PORT")
	if port == "" {
		port = "8009"
	}

	log.Printf("Review service running on port %s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal("Failed to start review service:", err)
	}
}
