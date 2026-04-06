package repository

import (
	"time"

	"github.com/ArteShow/Family-STEAM/services/message-service/internal/database"
	"github.com/google/uuid"
)

// Message is a single message within a thread.
type Message struct {
	ID           string    `json:"id"`
	ThreadID     string    `json:"thread_id"`
	SenderID     string    `json:"sender_id"`
	SenderName   string    `json:"sender_name"`
	ReceiverID   string    `json:"receiver_id"`
	ReceiverName string    `json:"receiver_name"`
	Subject      string    `json:"subject"`
	Content      string    `json:"content"`
	IsRead       bool      `json:"is_read"`
	CreatedAt    time.Time `json:"created_at"`
}

// Thread is a conversation summary (latest message info + count).
type Thread struct {
	ThreadID     string    `json:"thread_id"`
	Subject      string    `json:"subject"`
	SenderID     string    `json:"sender_id"`
	SenderName   string    `json:"sender_name"`
	ReceiverID   string    `json:"receiver_id"`
	ReceiverName string    `json:"receiver_name"`
	LastMessage  string    `json:"last_message"`
	LastAt       time.Time `json:"last_at"`
	MessageCount int       `json:"message_count"`
}

// Send creates a new message. If threadID is empty a new thread is created.
func Send(threadID, senderID, senderName, receiverID, receiverName, subject, content string) (string, error) {
	db, err := database.Connect()
	if err != nil {
		return "", err
	}

	if threadID == "" {
		threadID = uuid.NewString()
	}
	id := uuid.NewString()

	_, err = db.Exec(`
		INSERT INTO messages (id, thread_id, sender_id, sender_name, receiver_id, receiver_name, subject, content)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`, id, threadID, senderID, senderName, receiverID, receiverName, subject, content)
	return threadID, err
}

// GetAllThreads returns a summary of every thread (for admin).
func GetAllThreads() ([]Thread, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}

	rows, err := db.Query(`
		SELECT
			first_msg.thread_id,
			first_msg.subject,
			first_msg.sender_id,
			first_msg.sender_name,
			first_msg.receiver_id,
			first_msg.receiver_name,
			last_msg.content  AS last_message,
			last_msg.created_at AS last_at,
			cnt.msg_count
		FROM (
			SELECT DISTINCT ON (thread_id)
				thread_id, subject, sender_id, sender_name, receiver_id, receiver_name
			FROM messages
			ORDER BY thread_id, created_at ASC
		) first_msg
		JOIN (
			SELECT DISTINCT ON (thread_id)
				thread_id, content, created_at
			FROM messages
			ORDER BY thread_id, created_at DESC
		) last_msg ON first_msg.thread_id = last_msg.thread_id
		JOIN (
			SELECT thread_id, COUNT(*) AS msg_count
			FROM messages
			GROUP BY thread_id
		) cnt ON first_msg.thread_id = cnt.thread_id
		ORDER BY last_msg.created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var threads []Thread
	for rows.Next() {
		var t Thread
		if err = rows.Scan(
			&t.ThreadID, &t.Subject, &t.SenderID, &t.SenderName,
			&t.ReceiverID, &t.ReceiverName, &t.LastMessage, &t.LastAt, &t.MessageCount,
		); err != nil {
			return nil, err
		}
		threads = append(threads, t)
	}
	return threads, rows.Err()
}

// GetUserThreads returns thread summaries for a specific user.
func GetUserThreads(username string) ([]Thread, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}

	rows, err := db.Query(`
		SELECT
			first_msg.thread_id,
			first_msg.subject,
			first_msg.sender_id,
			first_msg.sender_name,
			first_msg.receiver_id,
			first_msg.receiver_name,
			last_msg.content  AS last_message,
			last_msg.created_at AS last_at,
			cnt.msg_count
		FROM (
			SELECT DISTINCT ON (thread_id)
				thread_id, subject, sender_id, sender_name, receiver_id, receiver_name
			FROM messages
			WHERE thread_id IN (
				SELECT DISTINCT thread_id FROM messages
				WHERE receiver_id = $1 OR sender_id = $1
			)
			ORDER BY thread_id, created_at ASC
		) first_msg
		JOIN (
			SELECT DISTINCT ON (thread_id)
				thread_id, content, created_at
			FROM messages
			ORDER BY thread_id, created_at DESC
		) last_msg ON first_msg.thread_id = last_msg.thread_id
		JOIN (
			SELECT thread_id, COUNT(*) AS msg_count
			FROM messages
			GROUP BY thread_id
		) cnt ON first_msg.thread_id = cnt.thread_id
		ORDER BY last_msg.created_at DESC
	`, username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var threads []Thread
	for rows.Next() {
		var t Thread
		if err = rows.Scan(
			&t.ThreadID, &t.Subject, &t.SenderID, &t.SenderName,
			&t.ReceiverID, &t.ReceiverName, &t.LastMessage, &t.LastAt, &t.MessageCount,
		); err != nil {
			return nil, err
		}
		threads = append(threads, t)
	}
	return threads, rows.Err()
}

// GetThread returns all messages in a thread, ordered oldest-first.
func GetThread(threadID string) ([]Message, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}

	rows, err := db.Query(`
		SELECT id, thread_id, sender_id, sender_name, receiver_id, receiver_name,
		       subject, content, is_read, created_at
		FROM messages
		WHERE thread_id = $1
		ORDER BY created_at ASC
	`, threadID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var msgs []Message
	for rows.Next() {
		var m Message
		if err = rows.Scan(
			&m.ID, &m.ThreadID, &m.SenderID, &m.SenderName,
			&m.ReceiverID, &m.ReceiverName, &m.Subject, &m.Content,
			&m.IsRead, &m.CreatedAt,
		); err != nil {
			return nil, err
		}
		msgs = append(msgs, m)
	}
	return msgs, rows.Err()
}

// MarkRead marks all unread messages in a thread addressed to username as read.
func MarkRead(threadID, username string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(`
		UPDATE messages SET is_read = true
		WHERE thread_id = $1 AND receiver_id = $2 AND is_read = false
	`, threadID, username)
	return err
}

// DeleteThread removes all messages in a thread.
func DeleteThread(threadID string) error {
	db, err := database.Connect()
	if err != nil {
		return err
	}

	_, err = db.Exec(`DELETE FROM messages WHERE thread_id = $1`, threadID)
	return err
}
