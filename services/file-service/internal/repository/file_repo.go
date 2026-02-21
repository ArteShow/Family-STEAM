package repository

import (
	"time"

	"github.com/ArteShow/Family-STEAM/services/file-service/internal/database"
)

type File struct {
	ID        string
	ParentID  string
	CreatedAt time.Time
}

func Create(id string, parentID string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(
		`INSERT INTO files (id, parent_id) VALUES ($1, $2)`,
		id,
		parentID,
	)

	return err
}

func Delete(id string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(
		`DELETE FROM files WHERE id = $1`,
		id,
	)

	return err
}

func GetByID(id string) (*File, error) {
	db, err := database.Connect()
	if err != nil {
		return &File{}, err
	}

	file := &File{}

	err = db.QueryRow(
		`SELECT id, parent_id, created_at FROM files WHERE id = $1`,
		id,
	).Scan(
		&file.ID,
		&file.ParentID,
		&file.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return file, nil
}