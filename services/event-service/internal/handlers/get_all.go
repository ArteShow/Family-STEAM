package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/event-service/internal/repository"
)

func GetAllHandler(w http.ResponseWriter, r *http.Request) {
	events, err := repository.GetAll(context.Background())

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := GetAllResponse{Events: events}
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}