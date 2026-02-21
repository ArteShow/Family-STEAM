package core

import "github.com/ArteShow/Family-STEAM/services/file-service/internal/docker"

func DownloadFile(FileID string) ([]byte, error) {
	file, err := docker.DownloadFile(FileID)
	if err != nil {
		return nil, err
	}

	return file, nil
}