package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/ArteShow/Family-STEAM/services/event-service/internal/db"
	"github.com/ArteShow/Family-STEAM/services/event-service/pkg/uuid"
)

type Event struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	StartsAt    string `json:"starts_at"`
	EndsAt      string `json:"ends_at"`
	Place       string `json:"place"`
	Price       string `json:"price"`
	Description string `json:"description"`
	CreatedAt   string `json:"created_at"`
}

func Create(ctx context.Context, e Event) (string, error) {
	conn, err := db.Connect()
	if err != nil {
		return "", err
	}
	defer conn.Close()

	id := uuid.CreateUUID()

	_, err = conn.ExecContext(ctx,
		`INSERT INTO event (id, name, starts_at, ends_at, place, price, description)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		id, e.Name, e.StartsAt, e.EndsAt, e.Place, e.Price, e.Description,
	)

	return id, err
}

func GetByID(ctx context.Context, id string) (*Event, error) {
	conn, err := db.Connect()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	var e Event

	err = conn.QueryRowContext(ctx,
		`SELECT id, name, starts_at, ends_at, place, price, description, created_at
		 FROM event WHERE id = $1`, id,
	).Scan(
		&e.ID,
		&e.Name,
		&e.StartsAt,
		&e.EndsAt,
		&e.Place,
		&e.Price,
		&e.Description,
		&e.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, err
	}

	return &e, err
}

func GetAll(ctx context.Context) ([]Event, error) {
	conn, err := db.Connect()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(ctx,
		`SELECT id, name, starts_at, ends_at, place, price, description, created_at FROM event`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []Event

	for rows.Next() {
		var e Event

		err = rows.Scan(
			&e.ID,
			&e.Name,
			&e.StartsAt,
			&e.EndsAt,
			&e.Place,
			&e.Price,
			&e.Description,
			&e.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		events = append(events, e)
	}

	return events, nil
}

func Delete(ctx context.Context, id string) error {
	conn, err := db.Connect()
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.ExecContext(ctx,
		`DELETE FROM event WHERE id = $1`, id,
	)

	return err
}

func UpdateColumn(ctx context.Context, id, column string, value any) error {
	conn, err := db.Connect()
	if err != nil {
		return err
	}
	defer conn.Close()

	allowed := map[string]bool{
		"name":        true,
		"starts_at":   true,
		"ends_at":     true,
		"place":       true,
		"price":       true,
		"description": true,
	}

	if !allowed[column] {
		return fmt.Errorf("invalid column")
	}

	query := fmt.Sprintf(`UPDATE event SET %s = $1 WHERE id = $2`, column)

	_, err = conn.ExecContext(ctx, query, value, id)

	return err
}
