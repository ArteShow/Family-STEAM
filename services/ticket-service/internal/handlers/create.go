package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/ticket-service/internal/repository"
)

func CreateTicketHandler(w http.ResponseWriter, r *http.Request) {
	// User identity is injected by the API gateway's UserAuth middleware
	userID := r.Header.Get("X-User-ID")
	username := r.Header.Get("X-Username")

	if userID == "" {
		http.Error(w, "unauthorized: missing user identity", http.StatusUnauthorized)
		return
	}

	var req CreateTicketRequest

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	if err = json.Unmarshal(body, &req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Subject == "" || req.Message == "" {
		http.Error(w, "subject and message are required", http.StatusBadRequest)
		return
	}

	// Use username as display name; email is optional contact info
	name := username
	if name == "" {
		name = userID
	}

	id, err := repository.Create(userID, username, name, req.Email, req.Subject, req.Message)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(CreateTicketResponse{TicketID: id}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
