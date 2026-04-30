package handlers

import (
	"encoding/json"
    "net/http"

    "github.com/ArteShow/Family-STEAM/services/file-service/internal/core"
)

func UploadHandler(w http.ResponseWriter, r *http.Request) {
    err := r.ParseMultipartForm(0)
		return
	}

	req := UploadRequest{
		ParentID: r.FormValue("parent_id"),
		FileName: r.FormValue("file_name"),
	}

	if req.ParentID == "" || req.FileName == "" {
		http.Error(w, "parent_id and file_name are required", http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "File error", http.StatusBadRequest)
		return
	}
	defer file.Close()

    id, err := core.UploadFile(req.FileName, req.ParentID, file)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
