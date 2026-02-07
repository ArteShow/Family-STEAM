package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/file-service/internal/repository"
)

func GetAllFiles(w http.ResponseWriter, r *http.Request) {
	files, err := repository.GetAllFiles(context.Background())
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	res := GetAllFilesResponse{Files: files}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}