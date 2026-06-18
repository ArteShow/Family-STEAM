package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/calendar-service/internal/repository"
)

func GetAllCalendarEntriesHandler(w http.ResponseWriter, r *http.Request) {
	entries, err := repository.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := GetAllCalendarEntriesResponse{CalendarEntries: entries}
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
