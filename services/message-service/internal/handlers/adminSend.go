package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/message-service/internal/repository"
)

// AdminSendHandler handles both new messages (thread_id="") and admin replies (thread_id set).
func AdminSendHandler(w http.ResponseWriter, r *http.Request) {
	var req AdminSendRequest

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

	if req.ReceiverID == "" || req.Content == "" {
		http.Error(w, "receiver_id and content are required", http.StatusBadRequest)
		return
	}

	if req.ThreadID == "" && req.Subject == "" {
		http.Error(w, "subject is required for a new thread", http.StatusBadRequest)
		return
	}

	if req.ReceiverName == "" {
		req.ReceiverName = req.ReceiverID
	}

	threadID, err := repository.Send(req.ThreadID, "admin", "Admin", req.ReceiverID, req.ReceiverName, req.Subject, req.Content)
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
