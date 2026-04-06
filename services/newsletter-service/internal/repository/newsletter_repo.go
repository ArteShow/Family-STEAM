package repository

import (
	"time"

	"github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/database"
	"github.com/google/uuid"
)

// Subscriber represents a newsletter subscriber.
type Subscriber struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	SubscribedAt time.Time `json:"subscribed_at"`
}

// Campaign represents a sent newsletter campaign.
type Campaign struct {
	ID             string    `json:"id"`
	Subject        string    `json:"subject"`
	Heading        string    `json:"heading"`
	Body           string    `json:"body"`
	RecipientCount int       `json:"recipient_count"`
	SentAt         time.Time `json:"sent_at"`
}

// Subscribe adds an email address to the subscriber list.
// It is a no-op (no error) if the email already exists.
func Subscribe(email string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	id := uuid.NewString()
	_, err = db.Exec(`
		INSERT INTO newsletter_subscribers (id, email)
		VALUES ($1, $2)
		ON CONFLICT (email) DO NOTHING
	`, id, email)
	return err
}

// Unsubscribe removes an email address from the subscriber list.
func Unsubscribe(email string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(`DELETE FROM newsletter_subscribers WHERE email = $1`, email)
	return err
}

// GetAllSubscribers returns every subscriber ordered by subscription date.
func GetAllSubscribers() ([]Subscriber, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}

	rows, err := db.Query(`
		SELECT id, email, subscribed_at
		FROM newsletter_subscribers
		ORDER BY subscribed_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subs []Subscriber
	for rows.Next() {
		var s Subscriber
		if err = rows.Scan(&s.ID, &s.Email, &s.SubscribedAt); err != nil {
			return nil, err
		}
		subs = append(subs, s)
	}
	return subs, rows.Err()
}

// SaveCampaign persists a record of a sent newsletter campaign.
func SaveCampaign(subject, heading, body string, recipientCount int) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	id := uuid.NewString()
	_, err = db.Exec(`
		INSERT INTO newsletter_campaigns (id, subject, heading, body, recipient_count)
		VALUES ($1, $2, $3, $4, $5)
	`, id, subject, heading, body, recipientCount)
	return err
}

// GetCampaigns returns all campaigns ordered by most recent first.
func GetCampaigns() ([]Campaign, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}

	rows, err := db.Query(`
		SELECT id, subject, heading, body, recipient_count, sent_at
		FROM newsletter_campaigns
		ORDER BY sent_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var campaigns []Campaign
	for rows.Next() {
		var c Campaign
		if err = rows.Scan(&c.ID, &c.Subject, &c.Heading, &c.Body, &c.RecipientCount, &c.SentAt); err != nil {
			return nil, err
		}
		campaigns = append(campaigns, c)
	}
	return campaigns, rows.Err()
}
