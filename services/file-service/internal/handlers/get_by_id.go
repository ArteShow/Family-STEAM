package handlers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/file-service/internal/repository"
)

func GetFileByID(w http.ResponseWriter, r *http.Request) {
	var req GetFileByIDRequest
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

	file, err := repository.GetFileByID(context.Background(), req.FileID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := GetFileByIDResponse{File: file}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}