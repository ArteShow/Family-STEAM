package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/ticket-service/internal/repository"
)

func GetAllTicketsHandler(w http.ResponseWriter, r *http.Request) {
	tickets, err := repository.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(GetAllTicketsResponse{Tickets: tickets}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
