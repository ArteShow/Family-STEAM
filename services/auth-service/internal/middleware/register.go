package middleware

import (
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/config"
)

func RegisterCheck(next http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cfg, err := config.Read()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return 
		}

		jwtKey := r.Header.Get("JWT_KEY")
		if jwtKey == "" || jwtKey != cfg.JWTSecret {
			http.Error(w, "you don't have permission to use this endpoint", http.StatusUnauthorized)
			return 
		}

		next.ServeHTTP(w, r)
	})
}