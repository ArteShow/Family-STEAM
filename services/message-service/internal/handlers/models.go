package handlers

import "github.com/ArteShow/Family-STEAM/services/message-service/internal/repository"

// ── Admin requests ────────────────────────────────────────────────────────────

type AdminSendRequest struct {
	ReceiverID   string `json:"receiver_id"`
	ReceiverName string `json:"receiver_name"`
	Subject      string `json:"subject"`
	Content      string `json:"content"`
	ThreadID     string `json:"thread_id"` // empty = new thread
}

type AdminSendResponse struct {
	ThreadID string `json:"thread_id"`
}

type AdminDeleteRequest struct {
	ThreadID string `json:"thread_id"`
}

// ── User requests ─────────────────────────────────────────────────────────────

type UserReplyRequest struct {
	ThreadID string `json:"thread_id"`
	Content  string `json:"content"`
}

type GetThreadRequest struct {
	ThreadID string `json:"thread_id"`
}

type MarkReadRequest struct {
	ThreadID string `json:"thread_id"`
}

// ── Responses ─────────────────────────────────────────────────────────────────

type ThreadsResponse struct {
	Threads []repository.Thread `json:"threads"`
}

type MessagesResponse struct {
	Messages []repository.Message `json:"messages"`
}
