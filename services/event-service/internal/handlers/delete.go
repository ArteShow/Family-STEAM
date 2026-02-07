package handlers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/event-service/internal/repository"
)

func DeleteHandler(w http.ResponseWriter, r *http.Request) {
	var req DeleteRequest
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

	if err = repository.Delete(context.Background(), req.EventID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}