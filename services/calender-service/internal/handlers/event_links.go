package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/calender-service/internal/repository"
)

type CreateEventLinkRequest struct {
	Link struct {
		CalenderEntryID string `json:"calender_entry_id"`
		TitleEn         string `json:"title_en"`
		TitleDe         string `json:"title_de"`
		TitleRu         string `json:"title_ru"`
		URL             string `json:"url"`
		LinkOrder       int    `json:"link_order"`
	} `json:"link"`
}

type CreateEventLinkResponse struct {
	LinkID string `json:"link_id"`
}

type GetEventLinksRequest struct {
	CalenderEntryID string `json:"calender_entry_id"`
}

type GetEventLinksResponse struct {
	Links []repository.EventLink `json:"links"`
}

type UpdateEventLinkRequest struct {
	Link struct {
		ID        string `json:"id"`
		TitleEn   string `json:"title_en"`
		TitleDe   string `json:"title_de"`
		TitleRu   string `json:"title_ru"`
		URL       string `json:"url"`
		LinkOrder int    `json:"link_order"`
	} `json:"link"`
}

type DeleteEventLinkRequest struct {
	LinkID string `json:"link_id"`
}

func CreateEventLinkHandler(w http.ResponseWriter, r *http.Request) {
	var req CreateEventLinkRequest

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

	id, err := repository.CreateEventLink(
		req.Link.CalenderEntryID,
		req.Link.TitleEn,
		req.Link.TitleDe,
		req.Link.TitleRu,
		req.Link.URL,
		req.Link.LinkOrder,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := CreateEventLinkResponse{LinkID: id}
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func GetEventLinksHandler(w http.ResponseWriter, r *http.Request) {
	var req GetEventLinksRequest

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

	links, err := repository.GetEventLinksByCalenderEntryID(req.CalenderEntryID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if links == nil {
		links = []repository.EventLink{}
	}

	res := GetEventLinksResponse{Links: links}
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func UpdateEventLinkHandler(w http.ResponseWriter, r *http.Request) {
	var req UpdateEventLinkRequest

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

	err = repository.UpdateEventLink(
		req.Link.ID,
		req.Link.TitleEn,
		req.Link.TitleDe,
		req.Link.TitleRu,
		req.Link.URL,
		req.Link.LinkOrder,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"updated": true}`))
}

func DeleteEventLinkHandler(w http.ResponseWriter, r *http.Request) {
	var req DeleteEventLinkRequest

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

	err = repository.DeleteEventLink(req.LinkID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"deleted": true}`))
}
