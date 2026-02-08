package handlers

import "github.com/ArteShow/Family-STEAM/services/event-service/internal/repository"

type CreateRequest struct {
	Name        string `json:"name"`
	StartsAt    string `json:"starts_at"`
	EndsAt      string `json:"ends_at"`
	Place       string `json:"place"`
	Price       string `json:"price"`
	Description string `json:"description"`
	ImageID string `json:"image_id"`
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
	Event *repository.Event `json:"event"`
}

type GetAllResponse struct {
	Events []repository.Event `json:"events"`
}

type UpdateColumnRequest struct {
	Column string `json:"column"`
	Value string `json:"value"`
	EventID string `json:"event_id"`
}