package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/message-service/internal/repository"
)

// UserReplyHandler lets an authenticated user reply to an existing thread.
func UserReplyHandler(w http.ResponseWriter, r *http.Request) {
	var req UserReplyRequest

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

	if req.ThreadID == "" || req.Content == "" {
		http.Error(w, "thread_id and content are required", http.StatusBadRequest)
		return
	}

	// User always replies to admin
	threadID, err := repository.Send(req.ThreadID, username, username, "admin", "Admin", "", req.Content)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(AdminSendResponse{ThreadID: threadID}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
