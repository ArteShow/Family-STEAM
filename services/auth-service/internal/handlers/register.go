package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/client"
	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/proto"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var req RegisterRequest
	err = json.Unmarshal(bytes, &req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if req.Password == "" || req.Username == "" {
		http.Error(w, "invalid username, email or password", http.StatusBadRequest)
		return
	}

	if len(req.Password) < 6 || len(req.Username) < 3 {
		http.Error(w, "username or password are too short", http.StatusBadRequest)
		return
	}

	userClient, err := client.NewUserClient()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer userClient.Close()

	saveUserRes, err := userClient.SaveUser(&proto.SaveUserRequest{
		Username: req.Username,
		Password: req.Password,
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	} else if !saveUserRes.GetSuccess() {
		http.Error(w, "failed to save user", http.StatusInternalServerError)
		return
	}

	res := RegisterResponse{ID: saveUserRes.GetId()}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}