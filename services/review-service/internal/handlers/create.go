package handlers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strings"

	"github.com/ArteShow/Family-STEAM/services/review-service/internal/config"
	"github.com/ArteShow/Family-STEAM/services/review-service/internal/repository"
)

func CreateReviewHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	username := r.Header.Get("X-Username")
	if userID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var req CreateReviewRequest
	if err = json.Unmarshal(body, &req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.CalendarID == "" {
		http.Error(w, "calendar_id is required", http.StatusBadRequest)
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

	// Check if user already left a review for this event
	alreadyReviewed, err := repository.ExistsByUserAndCalendar(userID, req.CalendarID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if alreadyReviewed {
		http.Error(w, "you have already reviewed this event", http.StatusConflict)
		return
	}

	// Enforce participation: check that (userID, calendarID) exists in client-service
	participated, err := checkParticipation(userID, req.CalendarID)
	if err != nil {
		http.Error(w, "failed to verify participation: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if !participated {
		http.Error(w, "you must have participated in this event to leave a review", http.StatusForbidden)
		return
	}

	// Use X-Username injected by gateway; override only if header present
	if username == "" {
		username = "Unknown"
	}

	id, err := repository.Create(req.CalendarID, userID, username, req.AvatarURL, req.Rating, req.ReviewText)
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

// checkParticipation calls client-service to verify userID registered for calendarID.
func checkParticipation(userID, calendarID string) (bool, error) {
	cfg, err := config.Read()
	if err != nil {
		return false, err
	}

	reqBody := map[string]string{"calender_entry_id": calendarID}
	bodyBytes, _ := json.Marshal(reqBody)

	resp, err := http.Post(
		cfg.ClientServiceURL+"/client-service/list",
		"application/json",
		bytes.NewBuffer(bodyBytes),
	)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false, nil
	}

	var listResp clientListResponse
	if err = json.NewDecoder(resp.Body).Decode(&listResp); err != nil {
		return false, err
	}

	for _, c := range listResp.Clients {
		if c.UserID == userID {
			return true, nil
		}
	}
	return false, nil
}
