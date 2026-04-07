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

func ListByParentID(parentID string) ([]File, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}

	rows, err := db.Query(
		`SELECT id, parent_id, file_name, created_at FROM files WHERE parent_id = $1 ORDER BY created_at ASC`,
		parentID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []File
	for rows.Next() {
		var f File
		if err := rows.Scan(&f.ID, &f.ParentID, &f.FileName, &f.CreatedAt); err != nil {
			return nil, err
		}
		files = append(files, f)
	}

	return files, rows.Err()
}
