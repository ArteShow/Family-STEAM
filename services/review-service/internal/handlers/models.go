package handlers

import "github.com/ArteShow/Family-STEAM/services/review-service/internal/repository"

// ── Create ────────────────────────────────────────────────────────────────────

type CreateReviewRequest struct {
	CalendarID string `json:"calendar_id"`
	AvatarURL  string `json:"avatar_url"`
	Rating     int    `json:"rating"`
	ReviewText string `json:"review_text"`
}

type CreateReviewResponse struct {
	ReviewID string `json:"review_id"`
}

// ── Admin Create ──────────────────────────────────────────────────────────────

type AdminCreateReviewRequest struct {
	CalendarID      string `json:"calendar_id"`
	DisplayUsername string `json:"display_username"`
	Rating          int    `json:"rating"`
	ReviewText      string `json:"review_text"`
}

// ── Get by Calendar ───────────────────────────────────────────────────────────

type GetByCalendarRequest struct {
	CalendarID string `json:"calendar_id"`
	Limit      int    `json:"limit"`
	Offset     int    `json:"offset"`
}

type GetByCalendarResponse struct {
	Reviews []repository.Review `json:"reviews"`
	Total   int                 `json:"total"`
}

// ── Delete ────────────────────────────────────────────────────────────────────

type DeleteReviewRequest struct {
	ReviewID string `json:"review_id"`
}

// ── Check Eligible ────────────────────────────────────────────────────────────

type CheckEligibleRequest struct {
	CalendarID string `json:"calendar_id"`
}

type CheckEligibleResponse struct {
	Eligible        bool `json:"eligible"`
	AlreadyReviewed bool `json:"already_reviewed"`
}

// ── Client Service response shape (for participation check) ──────────────────

type clientListItem struct {
	UserID string `json:"user_id"`
}

type clientListResponse struct {
	Clients []clientListItem `json:"clients"`
}
