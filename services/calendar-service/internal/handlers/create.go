package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/calendar-service/internal/repository"
)

func CreateCalendarEntryHandler(w http.ResponseWriter, r *http.Request) {
	var req CreateCalendarEntryRequest

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
			req.CalendarEntry.Location,
			req.CalendarEntry.Price,
			req.CalendarEntry.Tag,
			req.CalendarEntry.ImageIDs,
			req.CalendarEntry.Amount,
			req.CalendarEntry.TitleEn,
			req.CalendarEntry.TitleDe,
			req.CalendarEntry.TitleRu,
			req.CalendarEntry.DescriptionEn,
			req.CalendarEntry.DescriptionDe,
			req.CalendarEntry.DescriptionRu,
			req.CalendarEntry.Responsibility,
			req.CalendarEntry.StartsAt,
			req.CalendarEntry.EndsAt,
			req.CalendarEntry.Duration,
		)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := CreateCalendarEntryResponse{CalendarEntryID: id}
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
