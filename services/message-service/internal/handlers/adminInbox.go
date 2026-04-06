package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/message-service/internal/repository"
)

// AdminInboxHandler returns all thread summaries for the admin inbox.
func AdminInboxHandler(w http.ResponseWriter, r *http.Request) {
	threads, err := repository.GetAllThreads()
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
