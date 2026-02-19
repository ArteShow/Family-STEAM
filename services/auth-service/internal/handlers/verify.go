package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/client"
	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/proto"
)

func VerifyHandler(w http.ResponseWriter, r *http.Request) {
	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var req CheckUserIdRequest
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
	GrpcRes, err := userClient.CheckUserId(&proto.CheckUserIdRequest{
		Id: req.Id,
	})
	if err != nil || !GrpcRes.Success{
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}