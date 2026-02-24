package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/client-service/internal/repository"
)

func ListClientsHandler(w http.ResponseWriter, r *http.Request) {
	var req ListClientsRequest

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	if err = json.Unmarshal(body, &req); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if req.CalenderEntryID == "" {
		http.Error(w, "calender_entry_id is required", http.StatusBadRequest)
		return
	}

	clients, err := repository.GetByCalendarID(req.CalenderEntryID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := ListClientsResponse{Clients: clients}
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
