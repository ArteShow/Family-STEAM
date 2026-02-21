package handlers

import "github.com/ArteShow/Family-STEAM/services/calender-service/internal/repository"

type CreateCalenderEntryRequest struct {
	CalenderEntry repository.Calendar `json:"calender_entry"`
}

type CreateCalenderEntryResponse struct {
	CalenderEntryID string `json:"calender_entry_id"`
}

type DeleteCalenderEntryRequest struct {
	CalenderEntryID string `json:"calender_entry_id"`
}

type GetAllCalenderEntriesResponse struct {
	CalenderEntries []repository.Calendar `json:"calender_entries"`
}

type GetCalenderEntryByIDRequest struct {
	CalenderEntryID string `json:"calender_entry_id"`
}

type GetCalenderEntryByIDResponse struct{
	CalenderEntry repository.Calendar `json:"calender_entry"`
}