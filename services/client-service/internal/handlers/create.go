package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/client-service/internal/repository"
)

func CreateClientHandler(w http.ResponseWriter, r *http.Request) {
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

	id, err := repository.Create(
		req.Client.FirstName,
		req.Client.LastName,
		req.Client.Email,
		req.Client.Phone,
		req.Client.Birthday,
		req.Client.Age,
		req.Client.Camp,
		req.Client.Event,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := CreateClientResponse{ClientID: id}
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}