package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/ticket-service/internal/repository"
)

func CreateTicketHandler(w http.ResponseWriter, r *http.Request) {
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

	if req.Name == "" || req.Email == "" || req.Subject == "" || req.Message == "" {
		http.Error(w, "name, email, subject and message are required", http.StatusBadRequest)
		return
	}

	id, err := repository.Create(req.Name, req.Email, req.Subject, req.Message)
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
