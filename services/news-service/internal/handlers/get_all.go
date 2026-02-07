package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/news-service/internal/repository"
)

func GetAllNews(w http.ResponseWriter, r *http.Request) {
	camps, err := repository.GetAll(context.Background())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := GetAllNewsResponse{News: camps}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}