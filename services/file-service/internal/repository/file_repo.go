package repository

import (
	"time"

	"github.com/ArteShow/Family-STEAM/services/file-service/internal/database"
)

type File struct {
	ID        string
	ParentID  string
	FileName  string
	CreatedAt time.Time
}

func Create(id, parentID, fileName string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(
		`INSERT INTO files (id, parent_id, file_name) VALUES ($1, $2, $3)`,
		id,
		parentID,
		fileName,
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
