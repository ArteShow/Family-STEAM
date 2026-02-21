package handlers

type UploadRequest struct {
	ParentID string `json:"parent_id"`
	FileName string `json:"file_name"`
}

type UploadResponse struct {
	FileID string `json:"file_id"`
}