package handlers

import "github.com/ArteShow/Family-STEAM/services/calender-service/internal/repository"

type CreateRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Type        string `json:"type"`
	StartsAt    string `json:"starts_at"`
	EndsAt      string `json:"ends_at"`
}

type CreateResponse struct {
	EventID string `json:"event_id"`
}

type DeleteRequest struct {
	EventID string `json:"event_id"`
}

type GetByIDRequest struct {
	EventID string `json:"event_id"`
}

type GetByIDResponse struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Type        string `json:"type"`
	StartsAt    string `json:"starts_at"`
	EndsAt      string `json:"ends_at"`
}

type GetAllResponse struct {
	Events []repository.Event `json:"events"`
}