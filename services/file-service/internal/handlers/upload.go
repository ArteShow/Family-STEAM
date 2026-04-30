package handlers

import (
	"encoding/json"

	"fmt"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/file-service/internal/core"
)

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(0); err != nil {
		http.Error(w, fmt.Sprintf("invalid multipart form: %v", err), http.StatusBadRequest)
		return
	}

	req := UploadRequest{
		ParentID: r.FormValue("parent_id"),
		FileName: r.FormValue("file_name"),
	}

	w.Header().Set("Content-Type", "application/json")

	file, header, err := r.FormFile("file")
	if err != nil {
		file, header, err = r.FormFile("image")
	}
	if err != nil {
		file, header, err = r.FormFile("files")
	}
	if err != nil {
		http.Error(w, fmt.Sprintf("file upload field not found: %v", err), http.StatusBadRequest)
		return
	}
	defer file.Close()

	if req.FileName == "" && header != nil {
		req.FileName = header.Filename
	}

	if req.ParentID == "" || req.FileName == "" {
		http.Error(w, "parent_id and file_name are required", http.StatusBadRequest)
		return
	}

	id, err := core.UploadFile(req.FileName, req.ParentID, file)
	if err != nil {
		http.Error(w, fmt.Sprintf("upload error: %v", err), http.StatusInternalServerError)
		return
	}

	res := UploadResponse{FileID: id}
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
