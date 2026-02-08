package handlers

import "github.com/ArteShow/Family-STEAM/services/camp-service/internal/repository"

type CreateCampRequest struct {
	Name        string `json:"name"`
	StartsAt    string `json:"starts_at"`
	EndsAt      string `json:"ends_at"`
	Place       string `json:"place"`
	Price       string `json:"price"`
	Description string `json:"description"`
	ImageID string `json:"image_id"`
}

type CreateCampResponse struct {
	CampID string `json:"camp_id"`
}

type DeleteCampRequest struct {
	CampID string `json:"camp_id"`
}

type GetAllCampResponse struct {
	Camps []repository.Camp `json:"camps"`
}

type GetCampByIdRequest struct {
	CampID string `json:"camp_id"`
}

type GetCampByIdResponse struct{
	Camp repository.Camp `json:"camp"`
}

type UpdateColumnRequest struct {
	CampID string `json:"camp_id"`
	Column string `json:"column"`
	Value string `json:"value"`
}