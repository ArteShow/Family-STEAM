package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/calender-service/internal/repository"
)

func UpdateCalenderEntryImagesHandler(w http.ResponseWriter, r *http.Request) {
	var req UpdateCalenderEntryImagesRequest

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

	if err = repository.UpdateImageIDs(req.CalenderEntryID, req.ImageIDs); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
