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
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.CalenderEntry.ID == "" {
		http.Error(w, "missing calender_entry id", http.StatusBadRequest)
		return
	}

	err = repository.Update(
		req.CalenderEntry.ID,
		req.CalenderEntry.Location,
		req.CalenderEntry.Price,
		req.CalenderEntry.Tag,
		req.CalenderEntry.ImageIDs,
		req.CalenderEntry.Amount,
		req.CalenderEntry.TitleEn,
		req.CalenderEntry.TitleDe,
		req.CalenderEntry.TitleRu,
		req.CalenderEntry.DescriptionEn,
		req.CalenderEntry.DescriptionDe,
		req.CalenderEntry.DescriptionRu,
		req.CalenderEntry.Responsibility,
		req.CalenderEntry.StartsAt,
		req.CalenderEntry.EndsAt,
		req.CalenderEntry.Duration,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"updated": true}`))
}
