package docker

import (
	"errors"
    "io"
    "os"
    "path/filepath"

    "github.com/google/uuid"
)

const DataDir = "/data"

func UploadFile(file io.Reader, filename string) (string, error) {
    id := uuid.New().String()
    entryDir := filepath.Join(DataDir, id)

    err := os.MkdirAll(entryDir, 0o755)
    if err != nil {
        return "", err
    }

    filePath := filepath.Join(entryDir, filepath.Base(filename))
    out, err := os.Create(filePath)
    if err != nil {
        return "", err
    }
    defer out.Close()

    if _, err := io.Copy(out, file); err != nil {
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
