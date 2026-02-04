package repository

import (
	"context"
	"database/sql"
	"fmt"
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

type CalendarRepo struct {
	db *sql.DB
}

func NewCalendarRepo(db *sql.DB) *CalendarRepo {
	return &CalendarRepo{db: db}
}

func (r *CalendarRepo) Create(
	ctx context.Context,
	id string,
	title string,
	description string,
	eventType string,
	startsAt string,
	endsAt string,
) error {
	_, err := r.db.ExecContext(
		ctx,
		`INSERT INTO calendar (id, title, description, event_type, starts_at, ends_at)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		id, title, description, eventType, startsAt, endsAt,
	)
	return err
}

func (r *CalendarRepo) GetByID(
	ctx context.Context,
	id string,
) (*Event, error) {
	row := r.db.QueryRowContext(
		ctx,
		`SELECT id, title, description, event_type, starts_at, ends_at, created_at
		 FROM calendar WHERE id = $1`,
		id,
	)

	var c Event
	err := row.Scan(
		&c.ID,
		&c.Title,
		&c.Description,
		&c.EventType,
		&c.StartsAt,
		&c.EndsAt,
		&c.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &c, nil
}

func (r *CalendarRepo) GetAll(
	ctx context.Context,
) ([]Event, error) {
	rows, err := r.db.QueryContext(
		ctx,
		`SELECT id, title, description, event_type, starts_at, ends_at, created_at
		 FROM calendar`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []Event

	for rows.Next() {
		var c Event
		err := rows.Scan(
			&c.ID,
			&c.Title,
			&c.Description,
			&c.EventType,
			&c.StartsAt,
			&c.EndsAt,
			&c.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		result = append(result, c)
	}

	return result, nil
}

func (r *CalendarRepo) UpdateColumn(
	ctx context.Context,
	id string,
	column string,
	value any,
) error {
	query := fmt.Sprintf(
		`UPDATE calendar SET %s = $1 WHERE id = $2`,
		column,
	)

	_, err := r.db.ExecContext(ctx, query, value, id)
	return err
}

func (r *CalendarRepo) Delete(
	ctx context.Context,
	id string,
) error {
	_, err := r.db.ExecContext(
		ctx,
		`DELETE FROM calendar WHERE id = $1`,
		id,
	)
	return err
}
