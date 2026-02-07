package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/user-service/internal/repository"
)

func GetAllClients(w http.ResponseWriter, r *http.Request) {
	clients, err := repository.GetAllClients(context.Background())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := GetAllClientsResponse{Clients: clients}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}