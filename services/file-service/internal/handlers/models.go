package handlers

import "github.com/ArteShow/Family-STEAM/services/file-service/internal/repository"

type UploadFileResponse struct {
	FileID string `json:"file_id"`
}

type DownloadFileRequest struct {
	FileID   string `json:"file_id"`
	FileName string `json:"file_name"`
}

type DeleteFileRequest struct {
	FileID string `json:"file_id"`
}

type GetAllFilesResponse struct {
	Files []repository.File `json:"files"`
}

type GetFileByIDRequest struct {
	FileID string `json:"file_id"`
}

type GetFileByIDResponse struct {
	File repository.File `json:"file"`
}