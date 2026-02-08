package handlers

import "github.com/ArteShow/Family-STEAM/services/feedback-service/internal/repository"

type CreateRequest struct {
	Title string `json:"title"`
	Text string `json:"text"`
}

type CreateResponse struct {
	FeedbackID string `json:"feedback_id"`
}

type DeleteRequest struct {
	FeedbackID string `json:"feedback_id"`
}

type GetByIDRequest struct {
	FeedbackID string `json:"feedback_id"`
}

type GetByIDResponse struct {
	Feedback *repository.Feedback `json:"feedback"`
}

type GetAllResponse struct {
	Feedbacks []repository.Feedback `json:"feedbacks"`
}