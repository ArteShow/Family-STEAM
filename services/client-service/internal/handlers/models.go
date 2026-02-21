package handlers

import "github.com/ArteShow/Family-STEAM/services/client-service/internal/repository"

type CreateClientRequest struct {
	Client repository.Client
}

type CreateClientResponse struct {
	ClientID string `json:"client_id"`
}