package handlers

import "github.com/ArteShow/Family-STEAM/services/client-service/internal/repository"

type CreateClientRequest struct {
	Client repository.Client `json:"client"`
}

type CreateClientResponse struct {
	ClientID string `json:"client_id"`
}

type DeleteClientRequest struct {
	ClientID string `json:"client_id"`
}

type GetClientRequest struct {
	ClientID string `json:"client_id"`
}

type GetClientResponse struct {
	Client repository.Client `json:"client"`
}

type UpdateClientRequest struct {
	Value string `json:"value"`
	Column string `json:"column"`
	ClientID string `json:"client_id"`
}

type ListClientsRequest struct {
	CalenderEntryID string `json:"calender_entry_id"`
}

type ListClientsResponse struct {
	Clients []repository.Client `json:"clients"`
}