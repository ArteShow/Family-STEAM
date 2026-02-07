package core

import (
	"context"

	"github.com/ArteShow/Family-STEAM/services/file-service/internal/docker"
	"github.com/ArteShow/Family-STEAM/services/file-service/internal/repository"
)

func UploadFile(data []byte, name, mimeType string, size int64) (string, error) {
	id, err := docker.UploadFile(data, name)
	if err != nil {
		return "", err
	}

	if err = repository.CreateFile(context.Background(), repository.File{
		ID: id,
		Name: name,
		MimeType: mimeType,
		Size: size,
	}); err != nil {
		return "", err
	}

	return id, nil
}