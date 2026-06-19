package middleware

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type CheckUserIdRequest struct {
	Id string `json:"user_id"`
}

func jwtSecretBytes() []byte {
	secret := strings.TrimSpace(os.Getenv("JWT_SECRET"))
	if secret == "" {
		secret = "9f4d7c2a6e3b1a8f5c9d0e4b7a2f6c1d8e3b5a9f0c7d2e6b4a1f8c3d5e9b7a2"
	}
	return []byte(secret)
}

var authHTTPClient = &http.Client{Timeout: 10 * time.Second}

func isAllowedAdminUsername(username string) bool {
	allowList := strings.TrimSpace(os.Getenv("ADMIN_USERNAMES"))
	if allowList == "" {
		allowList = "admin"
	}

	for _, candidate := range strings.Split(allowList, ",") {
		if strings.EqualFold(strings.TrimSpace(candidate), strings.TrimSpace(username)) {
			return true
		}
	}

	return false
}

func AdminOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing token", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if token.Method == nil || token.Method.Alg() != jwt.SigningMethodHS256.Alg() {
				return nil, errors.New("unexpected signing method")
			}
			return jwtSecretBytes(), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		username, ok := claims["username"].(string)
		if !ok || strings.TrimSpace(username) == "" {
			http.Error(w, "Invalid username", http.StatusUnauthorized)
			return
		}

		if !isAllowedAdminUsername(username) {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		userID, ok := claims["user_id"].(string)
		if !ok {
			http.Error(w, "Invalid user_id", http.StatusUnauthorized)
			return
		}

		reqBody := CheckUserIdRequest{
			Id: userID,
		}

		bodyBytes, _ := json.Marshal(reqBody)

		req, err := http.NewRequest(http.MethodPost, "http://auth-service:8001/auth-service/verify", bytes.NewBuffer(bodyBytes))
		if err != nil {
			http.Error(w, "Auth service request error", http.StatusInternalServerError)
			return
		}
		req.Header.Set("Content-Type", "application/json")

		verifyResp, err := authHTTPClient.Do(req)
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

// UserAuth validates the JWT token and injects X-User-ID and X-Username headers.
// It does NOT verify against the user-service, so it's lighter-weight than AdminOnly.
func UserAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing token", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if token.Method == nil || token.Method.Alg() != jwt.SigningMethodHS256.Alg() {
				return nil, errors.New("unexpected signing method")
			}
			return jwtSecretBytes(), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		userID, _ := claims["user_id"].(string)
		username, _ := claims["username"].(string)

		if userID == "" {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		// Clone request and inject user identity headers for downstream services
		newReq := r.Clone(r.Context())
		newReq.Header.Set("X-User-ID", userID)
		newReq.Header.Set("X-Username", username)

		next.ServeHTTP(w, newReq)
	})
}
