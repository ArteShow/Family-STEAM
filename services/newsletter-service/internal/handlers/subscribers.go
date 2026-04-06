package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/repository"
)

// SubscribersHandler returns the full subscriber list (admin only).
func SubscribersHandler(w http.ResponseWriter, r *http.Request) {
	subs, err := repository.GetAllSubscribers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if subs == nil {
		subs = []repository.Subscriber{}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(SubscribersResponse{Subscribers: subs}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
