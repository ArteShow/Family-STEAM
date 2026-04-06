package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/message-service/internal/repository"
)

// AdminDeleteHandler deletes an entire thread and all its messages.
func AdminDeleteHandler(w http.ResponseWriter, r *http.Request) {
	var req AdminDeleteRequest

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

	if err = repository.DeleteThread(req.ThreadID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if _, err = w.Write([]byte(`{"status":"deleted"}`)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
