package core

import "github.com/ArteShow/Family-STEAM/services/file-service/internal/docker"

func DownloadFile(FileID, FileName string) ([]byte, error) {
	file, err := docker.DownloadFile(FileID, FileName)
	if err != nil {
		return nil, err
	}

	return file, nil
}