package repository

import (
	"time"

	"github.com/ArteShow/Family-STEAM/services/review-service/internal/database"
	"github.com/google/uuid"
)

type Review struct {
	ID         string    `json:"id"`
	CalendarID string    `json:"calendar_id"`
	UserID     string    `json:"user_id"`
	Username   string    `json:"username"`
	AvatarURL  string    `json:"avatar_url"`
	Rating     int       `json:"rating"`
	ReviewText string    `json:"review_text"`
	CreatedAt  time.Time `json:"created_at"`
}

func Create(calendarID, userID, username, avatarURL string, rating int, reviewText string) (string, error) {
	db, err := database.Connect()
	if err != nil {
		return "", err
	}

	id := uuid.NewString()

	_, err = db.Exec(`
		INSERT INTO reviews (id, calendar_id, user_id, username, avatar_url, rating, review_text)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`, id, calendarID, userID, username, avatarURL, rating, reviewText)

	return id, err
}

func GetByCalendarID(calendarID string, limit, offset int) ([]Review, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}

	rows, err := db.Query(`
		SELECT id, calendar_id, user_id, username, avatar_url, rating, review_text, created_at
		FROM reviews
		WHERE calendar_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`, calendarID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reviews := make([]Review, 0)
	for rows.Next() {
		var rev Review
		err = rows.Scan(
			&rev.ID,
			&rev.CalendarID,
			&rev.UserID,
			&rev.Username,
			&rev.AvatarURL,
			&rev.Rating,
			&rev.ReviewText,
			&rev.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		reviews = append(reviews, rev)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return reviews, nil
}

func CountByCalendarID(calendarID string) (int, error) {
	db, err := database.Connect()
	if err != nil {
		return 0, err
	}

	var count int
	err = db.QueryRow(`SELECT COUNT(*) FROM reviews WHERE calendar_id = $1`, calendarID).Scan(&count)
	return count, err
}

func ExistsByUserAndCalendar(userID, calendarID string) (bool, error) {
	db, err := database.Connect()
	if err != nil {
		return false, err
	}

	var exists bool
	err = db.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM reviews WHERE user_id = $1 AND calendar_id = $2)
	`, userID, calendarID).Scan(&exists)
	return exists, err
}

func Delete(id string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(`DELETE FROM reviews WHERE id = $1`, id)
	return err
}
