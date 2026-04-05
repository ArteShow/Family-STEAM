package repository

import (
	"time"

	"github.com/ArteShow/Family-STEAM/services/ticket-service/internal/database"
	"github.com/google/uuid"
)

type Ticket struct {
	ID            string     `json:"id"`
	UserID        string     `json:"user_id"`
	Username      string     `json:"username"`
	Name          string     `json:"name"`
	Email         string     `json:"email"`
	Subject       string     `json:"subject"`
	Message       string     `json:"message"`
	Status        string     `json:"status"`
	AdminResponse *string    `json:"admin_response"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

func Create(userID, username, name, email, subject, message string) (string, error) {
	id := uuid.NewString()

	db, err := database.Connect()
	if err != nil {
		return "", err
	}
	defer db.Close()

	_, err = db.Exec(`
		INSERT INTO tickets (id, user_id, username, name, email, subject, message, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, 'open')
	`, id, userID, username, name, email, subject, message)
	return id, err
}

func GetAll() ([]Ticket, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT id, user_id, username, name, email, subject, message, status, admin_response, created_at, updated_at
		FROM tickets
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tickets := []Ticket{}
	for rows.Next() {
		var t Ticket
		if err = rows.Scan(&t.ID, &t.UserID, &t.Username, &t.Name, &t.Email, &t.Subject, &t.Message, &t.Status, &t.AdminResponse, &t.CreatedAt, &t.UpdatedAt); err != nil {
			return nil, err
		}
		tickets = append(tickets, t)
	}
	return tickets, rows.Err()
}

// GetByUserID returns up to the last 5 tickets for a user, or tickets
// created within the last month — whichever gives more tickets up to 5.
func GetByUserID(userID string) ([]Ticket, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT id, user_id, username, name, email, subject, message, status, admin_response, created_at, updated_at
		FROM tickets
		WHERE user_id = $1
		  AND (created_at >= now() - INTERVAL '1 month'
		       OR id IN (
		           SELECT id FROM tickets WHERE user_id = $1
		           ORDER BY created_at DESC LIMIT 5
		       ))
		ORDER BY created_at DESC
		LIMIT 5
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tickets := []Ticket{}
	for rows.Next() {
		var t Ticket
		if err = rows.Scan(&t.ID, &t.UserID, &t.Username, &t.Name, &t.Email, &t.Subject, &t.Message, &t.Status, &t.AdminResponse, &t.CreatedAt, &t.UpdatedAt); err != nil {
			return nil, err
		}
		tickets = append(tickets, t)
	}
	return tickets, rows.Err()
}

func GetByEmail(email string) ([]Ticket, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT id, user_id, username, name, email, subject, message, status, admin_response, created_at, updated_at
		FROM tickets
		WHERE email = $1
		ORDER BY created_at DESC
	`, email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tickets := []Ticket{}
	for rows.Next() {
		var t Ticket
		if err = rows.Scan(&t.ID, &t.UserID, &t.Username, &t.Name, &t.Email, &t.Subject, &t.Message, &t.Status, &t.AdminResponse, &t.CreatedAt, &t.UpdatedAt); err != nil {
			return nil, err
		}
		tickets = append(tickets, t)
	}
	return tickets, rows.Err()
}

func Respond(id, response string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec(`
		UPDATE tickets SET admin_response = $1, updated_at = now() WHERE id = $2
	`, response, id)
	return err
}

func Close(id string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec(`
		UPDATE tickets SET status = 'closed', updated_at = now() WHERE id = $1
	`, id)
	return err
}

func Delete(id string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec(`DELETE FROM tickets WHERE id = $1`, id)
	return err
}

// GetTicketOwner returns the user_id that owns the ticket (for authorization checks).
func GetTicketOwner(id string) (string, error) {
	db, err := database.Connect()
	if err != nil {
		return "", err
	}
	defer db.Close()

	var userID string
	err = db.QueryRow(`SELECT user_id FROM tickets WHERE id = $1`, id).Scan(&userID)
	return userID, err
}
