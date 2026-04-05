package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/ticket-service/internal/repository"
)

func CloseTicketHandler(w http.ResponseWriter, r *http.Request) {
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

	if err = repository.Close(req.TicketID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
