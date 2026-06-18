package handlers

import "github.com/ArteShow/Family-STEAM/services/calendar-service/internal/repository"

type CreateCalendarEntryRequest struct {
	CalendarEntry repository.Calendar `json:"calendar_entry"`
}

type CreateCalendarEntryResponse struct {
	CalendarEntryID string `json:"calendar_entry_id"`
}

type DeleteCalendarEntryRequest struct {
	CalendarEntryID string `json:"calendar_entry_id"`
}

type GetAllCalendarEntriesResponse struct {
	CalendarEntries []repository.Calendar `json:"calendar_entries"`
}

type GetCalendarEntryByIDRequest struct {
	CalendarEntryID string `json:"calendar_entry_id"`
}

type GetCalendarEntryByIDResponse struct {
	CalendarEntry repository.Calendar `json:"calendar_entry"`
}

type UpdateCalendarEntryImagesRequest struct {
	CalendarEntryID string   `json:"calendar_entry_id"`
	ImageIDs        []string `json:"image_ids"`
}

type UpdateCalendarEntryRequest struct {
	CalendarEntryID string              `json:"calendar_entry_id"`
	CalendarEntry   repository.Calendar `json:"calendar_entry"`
}
