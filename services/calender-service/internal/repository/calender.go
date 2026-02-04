package repository

import (
	"context"
	"fmt"

	"github.com/ArteShow/Family-STEAM/services/calender-service/internal/db"
)

type Event struct {
	ID          string
	Title       string
	Description string
	EventType   string
	StartsAt    string
	EndsAt      string
	CreatedAt   string
}

func Create(ctx context.Context, id, title, description, eventType, startsAt, endsAt string) error {
	conn, err := db.Connect()
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.ExecContext(
		ctx,
		`INSERT INTO calendar (id, title, description, event_type, starts_at, ends_at)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		id, title, description, eventType, startsAt, endsAt,
	)
	return err
}

func GetByID(ctx context.Context, id string) (*Event, error) {
	conn, err := db.Connect()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	row := conn.QueryRowContext(
		ctx,
		`SELECT id, title, description, event_type, starts_at, ends_at, created_at
		 FROM calendar WHERE id = $1`,
		id,
	)

	var e Event
	err = row.Scan(
		&e.ID,
		&e.Title,
		&e.Description,
		&e.EventType,
		&e.StartsAt,
		&e.EndsAt,
		&e.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &e, nil
}

func GetAll(ctx context.Context) ([]Event, error) {
	conn, err := db.Connect()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(
		ctx,
		`SELECT id, title, description, event_type, starts_at, ends_at, created_at
		 FROM calendar`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []Event
	for rows.Next() {
		var e Event
		err := rows.Scan(
			&e.ID,
			&e.Title,
			&e.Description,
			&e.EventType,
			&e.StartsAt,
			&e.EndsAt,
			&e.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		events = append(events, e)
	}

	return events, nil
}

func UpdateColumn(ctx context.Context, id, column string, value any) error {
	conn, err := db.Connect()
	if err != nil {
		return err
	}
	defer conn.Close()

	query := fmt.Sprintf(`UPDATE calendar SET %s = $1 WHERE id = $2`, column)
	_, err = conn.ExecContext(ctx, query, value, id)
	return err
}

func Delete(ctx context.Context, id string) error {
	conn, err := db.Connect()
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.ExecContext(ctx, `DELETE FROM calendar WHERE id = $1`, id)
	return err
}
