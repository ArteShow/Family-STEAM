package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/message-service/internal/repository"
)

// UserThreadHandler returns all messages in a thread for the authenticated user.
// It verifies that the requesting user is part of the thread.
func UserThreadHandler(w http.ResponseWriter, r *http.Request) {
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

	username := r.Header.Get("X-Username")
	if username == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
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

	// Verify the requesting user is part of this thread
	involved := false
	for _, m := range messages {
		if m.SenderID == username || m.ReceiverID == username {
			involved = true
			break
		}
	}
	if !involved && len(messages) > 0 {
		http.Error(w, "forbidden", http.StatusForbidden)
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
