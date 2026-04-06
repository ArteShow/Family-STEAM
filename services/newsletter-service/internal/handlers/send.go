package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/config"
	"github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/email"
	"github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/repository"
)

// SendHandler sends a newsletter to all current subscribers and records the campaign.
// It is an admin-only endpoint (enforced at the gateway).
func SendHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req SendRequest

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()

		if err = json.Unmarshal(body, &req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if req.Subject == "" || req.Heading == "" || req.Body == "" {
			http.Error(w, "subject, heading, and body are required", http.StatusBadRequest)
			return
		}

		subs, err := repository.GetAllSubscribers()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		emails := make([]string, len(subs))
		for i, s := range subs {
			emails[i] = s.Email
		}

		if len(emails) > 0 {
			if err = email.SendNewsletter(cfg, emails, req.Subject, req.Heading, req.Body); err != nil {
				log.Printf("newsletter send error: %v", err)
				http.Error(w, "failed to send emails: "+err.Error(), http.StatusInternalServerError)
				return
			}
		}

		if err = repository.SaveCampaign(req.Subject, req.Heading, req.Body, len(emails)); err != nil {
			log.Printf("newsletter save campaign error: %v", err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err = json.NewEncoder(w).Encode(SendResponse{SentCount: len(emails)}); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}
