package handlers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/user-service/internal/repository"
)

func CreateClient(w http.ResponseWriter, r *http.Request) {
	var req CreateClientRequest
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

	id, err := repository.CreateClient(context.Background(), repository.Client{
		Name: req.Name,
		FamilyName: req.FamilyName,
		BirthDate: req.BirthDate,
		Number: req.Number,
		Email: req.Email,
		Type: req.Type,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := CreateClientResponse{ClientID: id}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}