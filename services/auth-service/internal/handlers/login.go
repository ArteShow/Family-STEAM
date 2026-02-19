package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"time"

	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/client"
	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/jwt"
	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/proto"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var req LoginRequest
	err = json.Unmarshal(bytes, &req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	userClient, err := client.NewUserClient()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer userClient.Close()
	GrpcRes, err := userClient.CompareLoginPassword(&proto.CompareLoginPasswordRequest{
		Username: req.Username,
		Password: req.Password,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	token, err := jwt.GenerateToken(GrpcRes.GetId(), time.Hour*24)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := LoginResponse{Token: token}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}