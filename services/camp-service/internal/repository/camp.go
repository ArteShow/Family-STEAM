package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/ArteShow/Family-STEAM/services/camp-service/internal/db"
	"github.com/google/uuid"
)

type Camp struct {
	ID          string
	Name        string
	StartsAt    string
	EndsAt      string
	Place       string
	Price       string
	Description string
	CreatedAt   time.Time
}

func CreateCamp(ctx context.Context, c Camp) (string, error) {
	conn, err := db.Connect()
	if err != nil {
		return "", err
	}
	defer conn.Close()

	id := uuid.New().String()

	_, err = conn.ExecContext(
		ctx,
		`INSERT INTO camp (id, name, starts_at, ends_at, place, price, description)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		id,
		c.Name,
		c.StartsAt,
		c.EndsAt,
		c.Place,
		c.Price,
		c.Description,
	)

	if err != nil {
		return "", err
	}

	return id, nil
}

func GetCampByID(ctx context.Context, id string) (*Camp, error) {
	conn, err := db.Connect()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	row := conn.QueryRowContext(
		ctx,
		`SELECT id, name, starts_at, ends_at, place, price, description, created_at
		 FROM camp WHERE id = $1`,
		id,
	)

	var c Camp

	err = row.Scan(
		&c.ID,
		&c.Name,
		&c.StartsAt,
		&c.EndsAt,
		&c.Place,
		&c.Price,
		&c.Description,
		&c.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, err
		}
		return nil, err
	}

	return &c, nil
}

func GetAllCamps(ctx context.Context) ([]Camp, error) {
	conn, err := db.Connect()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(
		ctx,
		`SELECT id, name, starts_at, ends_at, place, price, description, created_at
		 FROM camp`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var camps []Camp

	for rows.Next() {
		var c Camp

		err := rows.Scan(
			&c.ID,
			&c.Name,
			&c.StartsAt,
			&c.EndsAt,
			&c.Place,
			&c.Price,
			&c.Description,
			&c.CreatedAt,
		)

		if err != nil {
			return nil, err
		}

		camps = append(camps, c)
	}

	return camps, nil
}

func DeleteCamp(ctx context.Context, id string) error {
	conn, err := db.Connect()
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.ExecContext(
		ctx,
		`DELETE FROM camp WHERE id = $1`,
		id,
	)

	return err
}

func UpdateCampColumn(ctx context.Context, id, column string, value any) error {
	conn, err := db.Connect()
	if err != nil {
		return err
	}
	defer conn.Close()

	query := fmt.Sprintf(`UPDATE camp SET %s = $1 WHERE id = $2`, column)

	_, err = conn.ExecContext(ctx, query, value, id)

	return err
}
