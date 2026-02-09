package handlers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/event-service/internal/repository"
)

func CreateHandler(w http.ResponseWriter, r *http.Request) {
	var req CreateRequest
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

	id, err := repository.Create(context.Background(), repository.Event{
		Name: req.Name,
		Description: req.Description,
		StartsAt: req.StartsAt,
		EndsAt: req.EndsAt,
		Place: req.Place,
		Price: req.Price,
		ImageID: req.ImageID,
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := CreateResponse{EventID: id}
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}