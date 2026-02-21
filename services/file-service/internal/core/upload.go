package core

import (
	"github.com/ArteShow/Family-STEAM/services/file-service/internal/docker"
	"github.com/ArteShow/Family-STEAM/services/file-service/internal/repository"
)

func UploadFile(FileName, ParentID string, file []byte) (string, error) {
	id, err := docker.UploadFile(file, FileName)
	if err != nil {
		return "", err
	}

	if err := repository.Create(id, ParentID, FileName); err != nil {
		return "", err
	}

	return id, err
}