package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/message-service/internal/repository"
)

// MarkReadHandler marks all unread messages in a thread as read for the authenticated user.
func MarkReadHandler(w http.ResponseWriter, r *http.Request) {
	var req MarkReadRequest

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

	if err = repository.MarkRead(req.ThreadID, username); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if _, err = w.Write([]byte(`{"status":"ok"}`)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
