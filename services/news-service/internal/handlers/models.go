package handlers

import "github.com/ArteShow/Family-STEAM/services/news-service/internal/repository"

type CreateNewsRequest struct {
	Title       string `json:"title"`
	ImageID     string `json:"image_id"`
	Description string `json:"description"`
}

type CreateNewsResponse struct {
	NewsID string `json:"news_id"`
}

type DeleteNewsRequest struct {
	NewsID string `json:"news_id"`
}

type GetAllNewsResponse struct {
	News []repository.News `json:"news"`
}

type GetNewsByIdRequest struct {
	NewsID string `json:"news_id"`
}

type GetNewsByIdResponse struct{
	News repository.News `json:"news"`
}