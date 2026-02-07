package handlers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/event-service/internal/repository"
)

func GetByIDHandler(w http.ResponseWriter, r *http.Request) {
	var req GetByIDRequest
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

	event, err := repository.GetByID(
		context.Background(),
		req.EventID,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := GetByIDResponse{Event: event}
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}