package repository

import (
	"context"
	"database/sql"

	"github.com/ArteShow/Family-STEAM/services/feedback-service/internal/db"
	"github.com/ArteShow/Family-STEAM/services/feedback-service/pkg/uuid"
)

type News struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Text      string `json:"text"`
	CreatedAt string `json:"created_at"`
}

func Create(ctx context.Context, n News) (string, error) {
	conn, err := db.Connect()
	if err != nil {
		return "", err
	}
	defer conn.Close()

	id := uuid.CreateUUID()

	_, err = conn.ExecContext(ctx,
		`INSERT INTO news (id, title, text) VALUES ($1, $2, $3)`,
		id, n.Title, n.Text,
	)

	return id, err
}

func GetByID(ctx context.Context, id string) (*News, error) {
	conn, err := db.Connect()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	var n News

	err = conn.QueryRowContext(ctx,
		`SELECT id, title, text, created_at FROM news WHERE id = $1`,
		id,
	).Scan(
		&n.ID,
		&n.Title,
		&n.Text,
		&n.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, err
	}

	return &n, err
}

func GetAll(ctx context.Context) ([]News, error) {
	conn, err := db.Connect()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(ctx,
		`SELECT id, title, text, created_at FROM news`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []News

	for rows.Next() {
		var n News

		err = rows.Scan(
			&n.ID,
			&n.Title,
			&n.Text,
			&n.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		list = append(list, n)
	}

	return list, nil
}

func Delete(ctx context.Context, id string) error {
	conn, err := db.Connect()
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.ExecContext(ctx,
		`DELETE FROM news WHERE id = $1`,
		id,
	)

	return err
}
