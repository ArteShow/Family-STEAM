package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/file-service/internal/repository"
)

func ListHandler(w http.ResponseWriter, r *http.Request) {
	var req ListRequest

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

	if req.ParentID == "" {
		http.Error(w, "parent_id is required", http.StatusBadRequest)
		return
	}

	files, err := repository.ListByParentID(req.ParentID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	infos := make([]FileInfo, 0, len(files))
	for _, f := range files {
		infos = append(infos, FileInfo{ID: f.ID, FileName: f.FileName})
	}

	res := ListResponse{Files: infos}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
