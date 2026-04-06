package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/message-service/internal/repository"
)

// UserInboxHandler returns thread summaries for the authenticated user.
func UserInboxHandler(w http.ResponseWriter, r *http.Request) {
	username := r.Header.Get("X-Username")
	if username == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	threads, err := repository.GetUserThreads(username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if threads == nil {
		threads = []repository.Thread{}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(ThreadsResponse{Threads: threads}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
