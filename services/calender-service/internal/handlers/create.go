package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/calender-service/internal/repository"
)

func CreateCalenderEntryHandler(w http.ResponseWriter, r *http.Request) {
	var req CreateCalenderEntryRequest

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

	id, err := repository.Create(
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

	res := CreateCalenderEntryResponse{CalenderEntryID: id}
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}