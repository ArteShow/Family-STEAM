package handlers

import "github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/repository"

// SubscribeRequest is the body for POST /newsletter-service/subscribe.
type SubscribeRequest struct {
	Email string `json:"email"`
}

// UnsubscribeRequest is the body for POST /newsletter-service/unsubscribe.
type UnsubscribeRequest struct {
	Email string `json:"email"`
}

// SendRequest is the body for POST /newsletter-service/send.
type SendRequest struct {
	Subject string `json:"subject"`
	Heading string `json:"heading"`
	Body    string `json:"body"`
}

// SendResponse is returned after a successful newsletter send.
type SendResponse struct {
	SentCount int `json:"sent_count"`
}

// SubscribersResponse wraps a list of subscribers.
type SubscribersResponse struct {
	Subscribers []repository.Subscriber `json:"subscribers"`
}

// CampaignsResponse wraps a list of campaigns.
type CampaignsResponse struct {
	Campaigns []repository.Campaign `json:"campaigns"`
}
