package repository

import (
	"context"

	"github.com/ArteShow/Family-STEAM/services/file-service/internal/db"
)

type File struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	MimeType  string `json:"mime_type"`
	Size      int64  `json:"size"`
	CreatedAt string `json:"created_at"`
}

func CreateFile(ctx context.Context, f File) error {
	conn, err := db.Connect()
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.ExecContext(
		ctx,
		`INSERT INTO file (id, name, mime_type, size)
		 VALUES ($1, $2, $3, $4)`,
		f.ID,
		f.Name,
		f.MimeType,
		f.Size,
	)

	return err
}

func GetFileByID(ctx context.Context, id string) (File, error) {
	conn, err := db.Connect()
	if err != nil {
		return File{}, err
	}
	defer conn.Close()

	var f File

	err = conn.QueryRowContext(
		ctx,
		`SELECT id, name, mime_type, size, created_at FROM file WHERE id = $1`,
		id,
	).Scan(
		&f.ID,
		&f.Name,
		&f.MimeType,
		&f.Size,
		&f.CreatedAt,
	)

	return f, err
}

func GetAllFiles(ctx context.Context) ([]File, error) {
	conn, err := db.Connect()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(
		ctx,
		`SELECT id, name, mime_type, size, created_at FROM file`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []File

	for rows.Next() {
		var f File

		err := rows.Scan(
			&f.ID,
			&f.Name,
			&f.MimeType,
			&f.Size,
			&f.CreatedAt,
		)

		if err != nil {
			return nil, err
		}

		files = append(files, f)
	}

	return files, nil
}

func DeleteFile(ctx context.Context, id string) error {
	conn, err := db.Connect()
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.ExecContext(
		ctx,
		`DELETE FROM file WHERE id = $1`,
		id,
	)

	return err
}
