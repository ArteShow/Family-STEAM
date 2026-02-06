package repository

import (
	"context"

	"github.com/ArteShow/Family-STEAM/services/user-service/internal/db"
	"github.com/ArteShow/Family-STEAM/services/user-service/pkg/uuid"
)

type Client struct {
	ID         string
	Name       string
	FamilyName string
	BirthDate  string
	Email      string
	Number     string
	Type       string
	CreatedAt  string
}

func CreateClient(ctx context.Context, c Client) (string, error) {
	conn, err := db.Connect()
	if err != nil {
		return "", err
	}

	id := uuid.CreateUUID()

	_, err = conn.ExecContext(
		ctx,
		`INSERT INTO clients (id, name, family_name, birth_date, email, number, type)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		id,
		c.Name,
		c.FamilyName,
		c.BirthDate,
		c.Email,
		c.Number,
		c.Type,
	)

	return id, err
}

func GetClientByID(ctx context.Context, id string) (Client, error) {
	var c Client

	conn, err := db.Connect()
	if err != nil {
		return Client{}, err
	}

	err = conn.QueryRowContext(
		ctx,
		`SELECT id, name, family_name, birth_date, email, number, type, created_at
		 FROM clients WHERE id = $1`,
		id,
	).Scan(
		&c.ID,
		&c.Name,
		&c.FamilyName,
		&c.BirthDate,
		&c.Email,
		&c.Number,
		&c.Type,
		&c.CreatedAt,
	)

	return c, err
}

func GetAllClients(ctx context.Context) ([]Client, error) {
	conn, err := db.Connect()
	if err != nil {
		return nil, err
	}

	rows, err := conn.QueryContext(
		ctx,
		`SELECT id, name, family_name, birth_date, email, number, type, created_at FROM clients`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var clients []Client

	for rows.Next() {
		var c Client
		err := rows.Scan(
			&c.ID,
			&c.Name,
			&c.FamilyName,
			&c.BirthDate,
			&c.Email,
			&c.Number,
			&c.Type,
			&c.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		clients = append(clients, c)
	}

	return clients, nil
}

func DeleteClient(ctx context.Context, id string) error {
	conn, err := db.Connect()
	if err != nil {
		return err
	}

	_, err = conn.ExecContext(
		ctx,
		`DELETE FROM clients WHERE id = $1`,
		id,
	)

	return err
}
