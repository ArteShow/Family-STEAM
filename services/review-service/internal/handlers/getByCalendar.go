package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/review-service/internal/repository"
)

func GetByCalendarHandler(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var req GetByCalendarRequest
	if err = json.Unmarshal(body, &req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.CalendarID == "" {
		http.Error(w, "calendar_id is required", http.StatusBadRequest)
		return
	}

	limit := req.Limit
	if limit <= 0 || limit > 500 {
		limit = 20
	}

	offset := req.Offset
	if offset < 0 {
		offset = 0
	}

	reviews, err := repository.GetByCalendarID(req.CalendarID, limit, offset)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	total, err := repository.CountByCalendarID(req.CalendarID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return empty slice, not null
	if reviews == nil {
		reviews = []repository.Review{}
	}

	res := GetByCalendarResponse{Reviews: reviews, Total: total}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
