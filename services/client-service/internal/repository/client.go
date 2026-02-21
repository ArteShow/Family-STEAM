package repository

import (
	"fmt"
	"strings"
	"time"

	"github.com/ArteShow/Family-STEAM/services/client-service/internal/database"
	"github.com/google/uuid"
)

type Client struct {
	ID        string `json:"client_id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Paid string `json:"paid"`
	Birthday  *time.Time `json:"birthday"`
	Age       *int `json:"age"`
	Camp      *string `json:"camp"`
	Event     *string `json:"event"`
	CreatedAt time.Time `json:"created_at"`
}

func Create(firstName, lastName, email, phone string, paid string, birthday *time.Time, age *int, camp, event *string) (string, error) {
	db, err := database.Connect()
	if err != nil {
		return "", err
	}

	id := uuid.NewString()

	_, err = db.Exec(
		`INSERT INTO clients (id, first_name, last_name, email, phone, birthday, age, camp, event, paid) 
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		id, firstName, lastName, email, phone, birthday, age, camp, event, paid,
	)

	return id, err
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
		`SELECT id, first_name, last_name, email, phone, birthday, age, camp, event, paid, created_at
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
		&client.Paid,
		&client.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &client, nil
}

func UpdateClient(value, column, id string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	allowedColumns := map[string]struct{}{
		"first_name": {},
		"last_name":  {},
		"email":      {},
		"phone":      {},
		"paid":       {},
		"birthday":   {},
		"age":        {},
		"camp":       {},
		"event":      {},
	}

	normalizedColumn := strings.ToLower(strings.TrimSpace(column))
	if _, ok := allowedColumns[normalizedColumn]; !ok {
		return fmt.Errorf("invalid column: %s", column)
	}

	query := fmt.Sprintf("UPDATE clients SET %s = $1 WHERE id = $2", normalizedColumn)
	res, err := db.Exec(query, value, id)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("client not found: %s", id)
	}

	return nil
}
