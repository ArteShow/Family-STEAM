package repository

import (
	"time"

	"github.com/ArteShow/Family-STEAM/services/calender-service/internal/database"
	"github.com/google/uuid"
)

type EventLink struct {
	ID               string `json:"id"`
	CalenderEntryID  string `json:"calender_entry_id"`
	TitleEn          string `json:"title_en"`
	TitleDe          string `json:"title_de"`
	TitleRu          string `json:"title_ru"`
	URL              string `json:"url"`
	LinkOrder        int    `json:"link_order"`
	CreatedAt        time.Time `json:"created_at"`
}

func CreateEventLink(calenderEntryID, titleEn, titleDe, titleRu, url string, linkOrder int) (string, error) {
	id := uuid.NewString()
	db, err := database.Connect()
	if err != nil {
		return "", err
	}

	_, err = db.Exec(`
		INSERT INTO event_links (
			id,
			calender_entry_id,
			title_en,
			title_de,
			title_ru,
			url,
			link_order
		) VALUES ($1, $2, $3, $4, $5, $6, $7)
	`,
		id,
		calenderEntryID,
		titleEn,
		titleDe,
		titleRu,
		url,
		linkOrder,
	)

	return id, err
}

func GetEventLinksByCalenderEntryID(calenderEntryID string) ([]EventLink, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}

	rows, err := db.Query(`
		SELECT
			id,
			calender_entry_id,
			title_en,
			title_de,
			title_ru,
			url,
			link_order,
			created_at
		FROM event_links
		WHERE calender_entry_id = $1
		ORDER BY link_order ASC
	`, calenderEntryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var links []EventLink

	for rows.Next() {
		var link EventLink
		err := rows.Scan(
			&link.ID,
			&link.CalenderEntryID,
			&link.TitleEn,
			&link.TitleDe,
			&link.TitleRu,
			&link.URL,
			&link.LinkOrder,
			&link.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		links = append(links, link)
	}

	return links, nil
}

func UpdateEventLink(id, titleEn, titleDe, titleRu, url string, linkOrder int) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(`
		UPDATE event_links
		SET title_en = $1,
		    title_de = $2,
		    title_ru = $3,
		    url = $4,
		    link_order = $5
		WHERE id = $6
	`,
		titleEn,
		titleDe,
		titleRu,
		url,
		linkOrder,
		id,
	)

	return err
}

func DeleteEventLink(id string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(
		`DELETE FROM event_links WHERE id = $1`,
		id,
	)

	return err
}
