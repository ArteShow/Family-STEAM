package handlers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/feedback-service/internal/repository"
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

	feedback, err := repository.GetByID(
		context.Background(),
		req.FeedbackID,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := GetByIDResponse{Feedback: feedback}
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}