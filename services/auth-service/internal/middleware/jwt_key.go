package middleware

import (
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/config"
)

func JWTKeyMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cfg, err := config.Read()
		if err != nil {
			http.Error(w ,err.Error(), http.StatusInternalServerError)
			return 
		}

		if r.URL.Query().Get("jwt") != cfg.JWTSecret {
			http.Error(w, "your jwt key is invalid", http.StatusBadRequest)
			return 
		}

		next.ServeHTTP(w, r)
	})
}