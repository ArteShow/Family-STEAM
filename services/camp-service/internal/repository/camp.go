package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/ArteShow/Family-STEAM/services/camp-service/internal/db"
	"github.com/google/uuid"
)

type Camp struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	StartsAt    string `json:"starts_at"`
	EndsAt      string `json:"ends_at"`
	Place       string `json:"place"`
	Price       string `json:"price"`
	Description string `json:"description"`
	CreatedAt   string `json:"created_at"`
	ImageID     string `json:"image_id"`
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
		`INSERT INTO camp (id, name, starts_at, ends_at, place, price, description, image_id)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		id,
		c.Name,
		c.StartsAt,
		c.EndsAt,
		c.Place,
		c.Price,
		c.Description,
		c.ImageID,
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
		`SELECT id, name, starts_at, ends_at, place, price, description, created_at, image_id
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
		&c.ImageID,
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
		`SELECT id, name, starts_at, ends_at, place, price, description, created_at, image_id
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
			&c.ImageID,
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

	_, err = conn.ExecContext(ctx, `DELETE FROM camp WHERE id = $1`, id)
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
