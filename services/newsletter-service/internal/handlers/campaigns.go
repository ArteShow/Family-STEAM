package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/repository"
)

// CampaignsHandler returns the history of sent newsletter campaigns (admin only).
func CampaignsHandler(w http.ResponseWriter, r *http.Request) {
	campaigns, err := repository.GetCampaigns()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if campaigns == nil {
		campaigns = []repository.Campaign{}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(CampaignsResponse{Campaigns: campaigns}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
