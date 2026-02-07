package core

import (
	"context"

	"github.com/ArteShow/Family-STEAM/services/file-service/internal/docker"
	"github.com/ArteShow/Family-STEAM/services/file-service/internal/repository"
)

func DeleteFile(id string) error {
	if err := docker.DeleteFile(id); err != nil {
		return err
	}

	if err := repository.DeleteFile(context.Background(), id); err != nil {
		return err
	}

	return nil
}