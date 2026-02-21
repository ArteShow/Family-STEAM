package repository

import (
	"time"

	"github.com/ArteShow/Family-STEAM/services/client-service/internal/database"
)

type Client struct {
	ID        string
	FirstName string
	LastName  string
	Email     string
	Phone     string
	Birthday  *time.Time
	Age       *int
	Camp      *string
	Event     *string
	CreatedAt time.Time
}

func Create(id, firstName, lastName, email, phone string, birthday *time.Time, age *int, camp, event *string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(
		`INSERT INTO clients (id, first_name, last_name, email, phone, birthday, age, camp, event) 
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		id, firstName, lastName, email, phone, birthday, age, camp, event,
	)

	return err
}

func Delete(id string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(
		`DELETE FROM clients WHERE id = $1`,
		id,
	)

	return err
}

func GetByID(id string) (*Client, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}

	row := db.QueryRow(
		`SELECT id, first_name, last_name, email, phone, birthday, age, camp, event, created_at
		 FROM clients WHERE id = $1`,
		id,
	)

	var client Client
	err = row.Scan(
		&client.ID,
		&client.FirstName,
		&client.LastName,
		&client.Email,
		&client.Phone,
		&client.Birthday,
		&client.Age,
		&client.Camp,
		&client.Event,
		&client.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &client, nil
}
