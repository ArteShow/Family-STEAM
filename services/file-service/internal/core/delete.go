package core

import (
	"github.com/ArteShow/Family-STEAM/services/file-service/internal/docker"
	"github.com/ArteShow/Family-STEAM/services/file-service/internal/repository"
)

func DeleteFile(FileID string) error {
	if err := docker.RemoveFile(FileID); err != nil {
		return err
	}

	if err := repository.Delete(FileID); err != nil {
		return err
	}

	return nil
}