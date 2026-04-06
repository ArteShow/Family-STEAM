package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/calender-service/internal/repository"
)

func UpdateCalenderEntryHandler(w http.ResponseWriter, r *http.Request) {
	var req UpdateCalenderEntryRequest

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	if err = json.Unmarshal(body, &req); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if req.CalenderEntryID == "" {
		http.Error(w, "calender_entry_id is required", http.StatusBadRequest)
		return
	}

	e := req.CalenderEntry
	err = repository.Update(
		req.CalenderEntryID,
		e.Location,
		e.Price,
		e.Tag,
		e.Amount,
		e.TitleEn,
		e.TitleDe,
		e.TitleRu,
		e.DescriptionEn,
		e.DescriptionDe,
		e.DescriptionRu,
		e.Responsibility,
		e.StartsAt,
		e.EndsAt,
		e.Duration,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
