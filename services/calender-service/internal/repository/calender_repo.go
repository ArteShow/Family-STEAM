package repository

import (
	"time"

	"github.com/ArteShow/Family-STEAM/services/calender-service/internal/database"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

type Calendar struct {
	ID             string     `json:"id"`
	Location       string     `json:"location"`
	Price          int        `json:"price"`
	Tag            string     `json:"tag"`
	ImageIDs       []string   `json:"image_ids"`
	Amount         int        `json:"amount"`
	TitleEn        string     `json:"title_en"`
	TitleDe        string     `json:"title_de"`
	TitleRu        string     `json:"title_ru"`
	DescriptionEn  string     `json:"description_en"`
	DescriptionDe  string     `json:"description_de"`
	DescriptionRu  string     `json:"description_ru"`
	Responsibility *string    `json:"responsibility"`
	StartsAt       *time.Time `json:"starts_at"`
	EndsAt         *time.Time `json:"ends_at"`
	Duration       *string    `json:"duration"`
	CreatedAt      time.Time  `json:"created_at"`
}

func Create(
	location string,
	price int,
	tag string,
	imageIDs []string,
	amount int,
	titleEn string,
	titleDe string,
	titleRu string,
	descriptionEn string,
	descriptionDe string,
	descriptionRu string,
	responsibility *string,
	startsAt *time.Time,
	endsAt *time.Time,
	duration *string,
) (string, error) {

	id := uuid.NewString()

	db, err := database.Connect()
	if err != nil {
		return "", err
	}

	_, err = db.Exec(`
		INSERT INTO calendar (
			id,
			location,
			price,
			tag,
			image_ids,
			amount,
			title_en,
			title_de,
			title_ru,
			description_en,
			description_de,
			description_ru,
			responsibility,
			starts_at,
			ends_at,
			duration
		)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
	`,
		id,
		location,
		price,
		tag,
		pq.Array(imageIDs),
		amount,
		titleEn,
		titleDe,
		titleRu,
		descriptionEn,
		descriptionDe,
		descriptionRu,
		responsibility,
		startsAt,
		endsAt,
		duration,
	)

	return id, err
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
			title_en,
			title_de,
			title_ru,
			description_en,
			description_de,
			description_ru,
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
		&c.TitleEn,
		&c.TitleDe,
		&c.TitleRu,
		&c.DescriptionEn,
		&c.DescriptionDe,
		&c.DescriptionRu,
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
			title_en,
			title_de,
			title_ru,
			description_en,
			description_de,
			description_ru,
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
			&c.TitleEn,
			&c.TitleDe,
			&c.TitleRu,
			&c.DescriptionEn,
			&c.DescriptionDe,
			&c.DescriptionRu,
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

func UpdateImageIDs(id string, imageIDs []string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(
		`UPDATE calendar SET image_ids = $1 WHERE id = $2`,
		pq.Array(imageIDs),
		id,
	)

	return err
}
