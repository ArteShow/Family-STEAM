package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"

	"github.com/ArteShow/Family-STEAM/services/review-service/internal/repository"
	"github.com/google/uuid"
)

// AdminCreateReviewHandler creates a review on behalf of the admin.
// It bypasses the participation check and deduplication constraint by
// storing a unique sentinel user_id ("admin:<uuid>") for every admin review.
func AdminCreateReviewHandler(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var req AdminCreateReviewRequest
	if err = json.Unmarshal(body, &req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.CalendarID == "" {
		http.Error(w, "calendar_id is required", http.StatusBadRequest)
		return
	}

	displayName := strings.TrimSpace(req.DisplayUsername)
	if displayName == "" {
		http.Error(w, "display_username is required", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.ReviewText) == "" {
		http.Error(w, "review_text is required", http.StatusBadRequest)
		return
	}

	if req.Rating < 1 || req.Rating > 5 {
		http.Error(w, "rating must be between 1 and 5", http.StatusBadRequest)
		return
	}

	// Unique sentinel user_id so UNIQUE(user_id, calendar_id) is never violated.
	adminUserID := "admin:" + uuid.NewString()

	// avatar_url is left empty; the frontend renders a capital-letter avatar.
	id, err := repository.Create(req.CalendarID, adminUserID, displayName, "", req.Rating, req.ReviewText)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := CreateReviewResponse{ReviewID: id}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
