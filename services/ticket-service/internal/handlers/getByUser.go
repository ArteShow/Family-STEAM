package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/ticket-service/internal/repository"
)

func GetByUserHandler(w http.ResponseWriter, r *http.Request) {
	// User identity injected by API gateway's UserAuth middleware
	userID := r.Header.Get("X-User-ID")

	if userID == "" {
		http.Error(w, "unauthorized: missing user identity", http.StatusUnauthorized)
		return
	}

	tickets, err := repository.GetByUserID(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(GetByUserResponse{Tickets: tickets}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
