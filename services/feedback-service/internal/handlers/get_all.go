package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/feedback-service/internal/repository"
)

func GetAllHandler(w http.ResponseWriter, r *http.Request) {
	feedbacks, err := repository.GetAll(context.Background())

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := GetAllResponse{Feedbacks: feedbacks}
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}