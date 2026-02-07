package handlers

import "github.com/ArteShow/Family-STEAM/services/user-service/internal/repository"

type CreateClientRequest struct {
	Name       string `json:"name"`
	FamilyName string `json:"family_name"`
	BirthDate  string `json:"birth_date"`
	Email      string `json:"email"`
	Number     string `json:"number"`
	Type       string `json:"type"`
}

type CreateClientResponse struct {
	ClientID string `json:"client_id"`
}

type DeleteClientRequest struct {
	ClientID string `json:"client_id"`
}

type GetAllClientsResponse struct {
	Clients []repository.Client `json:"clients"`
}

type GetClientByIDRequest struct {
	ClientID string `json:"client_id"`
}

type GetClientByIDResponse struct {
	Client repository.Client `json:"client"`
}