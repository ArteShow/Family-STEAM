package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"

	"github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/repository"
)

// SubscribeHandler adds an email to the newsletter subscriber list.
func SubscribeHandler(w http.ResponseWriter, r *http.Request) {
	var req SubscribeRequest

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

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" || !strings.Contains(req.Email, "@") {
		http.Error(w, "valid email is required", http.StatusBadRequest)
		return
	}

	if err = repository.Subscribe(req.Email); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if _, err = w.Write([]byte(`{"status":"subscribed"}`)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
