package middleware

import (
	"bytes"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type CheckUserIdRequest struct {
	Id string `json:"user_id"`
}

var jwtSecret = []byte("9f4d7c2a6e3b1a8f5c9d0e4b7a2f6c1d8e3b5a9f0c7d2e6b4a1f8c3d5e9b7a2")

func AdminOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing token", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		userID, ok := claims["user_id"].(string)
		if !ok {
			http.Error(w, "Invalid user_id", http.StatusUnauthorized)
			return
		}

		reqBody := CheckUserIdRequest{
			Id: userID,
		}

		bodyBytes, _ := json.Marshal(reqBody)

		verifyResp, err := http.Post(
			"http://auth-service:8001/auth-service/verify",
			"application/json",
			bytes.NewBuffer(bodyBytes),
		)
		if err != nil {
			http.Error(w, "Auth service error", http.StatusInternalServerError)
			return
		}
		defer verifyResp.Body.Close()

		if verifyResp.StatusCode != http.StatusOK {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
