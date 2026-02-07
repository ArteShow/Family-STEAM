package middleware

import (
	"context"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/user-service/internal/repository"
)

func AdminCheckMiddleware(next http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := r.Header.Get("X-Owner-ID")
		if userID == "" {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		user, err := repository.GetUserByID(context.Background(), userID)
		if err != nil || user.ID == "" {
			http.Error(w, err.Error()+" or the user is not the admin", http.StatusBadRequest)
			return 
		}

		next.ServeHTTP(w, r)
	})
}