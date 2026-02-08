package repository

import (
	"context"
	"database/sql"

	"github.com/ArteShow/Family-STEAM/services/feedback-service/internal/db"
	"github.com/ArteShow/Family-STEAM/services/feedback-service/pkg/uuid"
)

type Feedback struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Text      string `json:"text"`
	CreatedAt string `json:"created_at"`
}

func Create(ctx context.Context, n Feedback) (string, error) {
	conn, err := db.Connect()
	if err != nil {
		return "", err
	}
	defer conn.Close()

	id := uuid.CreateUUID()

	_, err = conn.ExecContext(ctx,
		`INSERT INTO feedback (id, title, text) VALUES ($1, $2, $3)`,
		id, n.Title, n.Text,
	)

	return id, err
}

func GetByID(ctx context.Context, id string) (*Feedback, error) {
	conn, err := db.Connect()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	var n Feedback

	err = conn.QueryRowContext(ctx,
		`SELECT id, title, text, created_at FROM feedback WHERE id = $1`,
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

func GetAll(ctx context.Context) ([]Feedback, error) {
	conn, err := db.Connect()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(ctx,
		`SELECT id, title, text, created_at FROM feedback`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Feedback

	for rows.Next() {
		var n Feedback

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
		`DELETE FROM feedback WHERE id = $1`,
		id,
	)

	return err
}
