package handlers

import "github.com/ArteShow/Family-STEAM/services/ticket-service/internal/repository"

type CreateTicketRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

type CreateTicketResponse struct {
	TicketID string `json:"ticket_id"`
}

type GetAllTicketsResponse struct {
	Tickets []repository.Ticket `json:"tickets"`
}

type GetByEmailRequest struct {
	Email string `json:"email"`
}

type GetByEmailResponse struct {
	Tickets []repository.Ticket `json:"tickets"`
}

type RespondRequest struct {
	TicketID string `json:"ticket_id"`
	Response string `json:"response"`
}

type CloseTicketRequest struct {
	TicketID string `json:"ticket_id"`
}

type DeleteTicketRequest struct {
	TicketID string `json:"ticket_id"`
}
