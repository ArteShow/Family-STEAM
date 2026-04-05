package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/ticket-service/internal/repository"
)

func CloseTicketHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var req CloseTicketRequest

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

	if req.TicketID == "" {
		http.Error(w, "ticket_id is required", http.StatusBadRequest)
		return
	}

	// Verify the ticket belongs to the requesting user
	owner, err := repository.GetTicketOwner(req.TicketID)
	if err != nil {
		http.Error(w, "ticket not found", http.StatusNotFound)
		return
	}
	if owner != userID {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	if err = repository.Close(req.TicketID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
