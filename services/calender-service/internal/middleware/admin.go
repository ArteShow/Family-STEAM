package middleware

import (
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/calender-service/internal/client"
)

func AdminCheckMiddleware(next http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := r.Header.Get("X-Owner-ID")
		if userID == "" {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		ok, err := client.IsUserTheAdmin(userID)
		if err != nil || !ok {
			http.Error(w, err.Error()+" or the user is not the admin", http.StatusBadRequest)
			return 
		}

		next.ServeHTTP(w, r)
	})
}