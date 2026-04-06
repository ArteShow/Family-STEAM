package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/message-service/internal/repository"
)

// AdminThreadHandler returns all messages in a thread (admin view – no ownership check).
func AdminThreadHandler(w http.ResponseWriter, r *http.Request) {
	var req GetThreadRequest

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	if err = json.Unmarshal(body, &req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.ThreadID == "" {
		http.Error(w, "thread_id is required", http.StatusBadRequest)
		return
	}

	messages, err := repository.GetThread(req.ThreadID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if messages == nil {
		messages = []repository.Message{}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(MessagesResponse{Messages: messages}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
