package handlers

type CreateRequest struct {
	Title       string
	Description string
	Type        string
	StartsAt    string
	EndsAt      string
}

type CreateResponse struct {
	EventID string
}