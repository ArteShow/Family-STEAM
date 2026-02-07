package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/file-service/internal/core"
)

func DeleteFile(w http.ResponseWriter, r *http.Request) {
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

	if err = core.DeleteFile(req.FileID); err != nil{
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}