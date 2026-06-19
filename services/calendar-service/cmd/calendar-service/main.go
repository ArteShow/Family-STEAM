package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ArteShow/Family-STEAM/services/calendar-service/internal/handlers"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/calendar-service/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/calendar-service/create", handlers.CreateCalendarEntryHandler)
	mux.HandleFunc("/calendar-service/delete", handlers.DeleteCalendarEntryHandler)
	mux.HandleFunc("/calendar-service/get", handlers.GetCalendarEntryHandler)
	mux.HandleFunc("/calendar-service/getAll", handlers.GetAllCalendarEntriesHandler)
	mux.HandleFunc("/calendar-service/update-images", handlers.UpdateCalendarEntryImagesHandler)
	mux.HandleFunc("/calendar-service/update", handlers.UpdateCalendarEntryHandler)

	port := os.Getenv("CALENDAR_SERVICE_PORT")
	if port == "" {
		port = "8005"
	}

	log.Printf("Calendar service running on port %s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal("Failed to start calendar service:", err)
	}
}
