package handlers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/file-service/internal/docker"
	"github.com/ArteShow/Family-STEAM/services/file-service/internal/repository"
)

func DownloadFile(w http.ResponseWriter, r *http.Request) {
	var req DownloadFileRequest
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

	meta, err := repository.GetFileByID(context.Background(), req.FileID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := docker.DownloadFile(req.FileID, req.FileName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", meta.MimeType)
	w.Write(data)
}