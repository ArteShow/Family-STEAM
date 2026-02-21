package repository

import (
	"fmt"
	"strings"
	"time"

	"github.com/ArteShow/Family-STEAM/services/client-service/internal/database"
	"github.com/google/uuid"
)

type Client struct {
	ID         string     `json:"client_id"`
	CalendarID string     `json:"calendar_id"`
	FirstName  string     `json:"first_name"`
	LastName   string     `json:"last_name"`
	Email      string     `json:"email"`
	Phone      string     `json:"phone"`
	Paid       bool       `json:"paid"`
	Birthday   *time.Time `json:"birthday"`
	Age        *int       `json:"age"`
	CreatedAt  time.Time  `json:"created_at"`
}

func Create(calendarID, firstName, lastName, email, phone string, paid bool, birthday *time.Time, age *int) (string, error) {
	db, err := database.Connect()
	if err != nil {
		return "", err
	}

	id := uuid.NewString()

	_, err = db.Exec(
		`INSERT INTO clients (id, calendar_id, first_name, last_name, email, phone, paid, birthday, age) 
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		id, calendarID, firstName, lastName, email, phone, paid, birthday, age,
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
		`SELECT id, calendar_id, first_name, last_name, email, phone, paid, birthday, age, created_at
		 FROM clients WHERE id = $1`,
		id,
	)

	var client Client
	err = row.Scan(
		&client.ID,
		&client.CalendarID,
		&client.FirstName,
		&client.LastName,
		&client.Email,
		&client.Phone,
		&client.Paid,
		&client.Birthday,
		&client.Age,
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
		"calendar_id": {},
		"first_name": {},
		"last_name":  {},
		"email":      {},
		"phone":      {},
		"paid":       {},
		"birthday":   {},
		"age":        {},
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
