package handlers

type UploadFileResponse struct {
	FileID string `json:"file_id"`
}

type DownloadFileRequest struct {
	FileID   string `json:"file_id"`
	FileName string `json:"file_name"`
}