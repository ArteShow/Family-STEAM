package docker

import (
	"errors"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

const DataDir = "/data"

func UploadFile(fileBytes []byte, filename string) (string, error) {
	id := uuid.New().String()
	entryDir := filepath.Join(DataDir, id)

	err := os.MkdirAll(entryDir, 0o755)
	if err != nil {
		return "", err
	}

	filePath := filepath.Join(entryDir, filepath.Base(filename))
	err = os.WriteFile(filePath, fileBytes, 0o644)
	if err != nil {
		return "", err
	}

	return id, nil
}

func DownloadFile(id string) ([]byte, error) {
	entryDir := filepath.Join(DataDir, id)
	entries, err := os.ReadDir(entryDir)
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		filePath := filepath.Join(entryDir, entry.Name())
		data, readErr := os.ReadFile(filePath)
		if readErr != nil {
			return nil, readErr
		}

		return data, nil
	}

	return nil, errors.New("file not found in folder")
}

func RemoveFile(id string) error {
	return os.RemoveAll(filepath.Join(DataDir, id))
}
