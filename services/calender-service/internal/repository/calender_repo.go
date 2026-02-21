package repository

import (
	"time"

	"github.com/ArteShow/Family-STEAM/services/calender-service/internal/database"
	"github.com/lib/pq"
)

type Calendar struct {
	ID             string
	Location       string
	Price          int
	Tag            string
	ImageIDs       []string
	Amount         int
	Title          string
	Description    string
	Responsibility *string
	StartsAt       *time.Time
	EndsAt         *time.Time
	Duration       *string
	CreatedAt      time.Time
}

func Create(
	id string,
	location string,
	price int,
	tag string,
	imageIDs []string,
	amount int,
	title string,
	description string,
	responsibility *string,
	startsAt *time.Time,
	endsAt *time.Time,
	duration *string,
) error {

	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(`
		INSERT INTO calendar (
			id,
			location,
			price,
			tag,
			image_ids,
			amount,
			title,
			description,
			responsibility,
			starts_at,
			ends_at,
			duration
		)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
	`,
		id,
		location,
		price,
		tag,
		pq.Array(imageIDs),
		amount,
		title,
		description,
		responsibility,
		startsAt,
		endsAt,
		duration,
	)

	return err
}

func Delete(id string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(
		`DELETE FROM calendar WHERE id = $1`,
		id,
	)

	return err
}

func GetByID(id string) (*Calendar, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}

	row := db.QueryRow(`
		SELECT
			id,
			location,
			price,
			tag,
			image_ids,
			amount,
			title,
			description,
			responsibility,
			starts_at,
			ends_at,
			duration,
			created_at
		FROM calendar
		WHERE id = $1
	`, id)

	var c Calendar

	err = row.Scan(
		&c.ID,
		&c.Location,
		&c.Price,
		&c.Tag,
		pq.Array(&c.ImageIDs),
		&c.Amount,
		&c.Title,
		&c.Description,
		&c.Responsibility,
		&c.StartsAt,
		&c.EndsAt,
		&c.Duration,
		&c.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &c, nil
}

func GetAll() ([]Calendar, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}

	rows, err := db.Query(`
		SELECT
			id,
			location,
			price,
			tag,
			image_ids,
			amount,
			title,
			description,
			responsibility,
			starts_at,
			ends_at,
			duration,
			created_at
		FROM calendar
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Calendar

	for rows.Next() {
		var c Calendar

		err := rows.Scan(
			&c.ID,
			&c.Location,
			&c.Price,
			&c.Tag,
			pq.Array(&c.ImageIDs),
			&c.Amount,
			&c.Title,
			&c.Description,
			&c.Responsibility,
			&c.StartsAt,
			&c.EndsAt,
			&c.Duration,
			&c.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		list = append(list, c)
	}

	return list, nil
}
