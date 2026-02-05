package core

import (
	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/client"
	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/proto"
	"github.com/ArteShow/Family-STEAM/services/auth-service/pkg/hashing"
)

func Register(username, password string) (string, error) {
	client, err := client.NewUserClient()
	if err != nil {
		return "", err
	}
	defer client.Close()

	hash, err := hashing.HashPassword(password)
	if err != nil {
		return "", err
	}

	res, err := client.SaveUser(&proto.SaveUserRequest{
		Username: username,
		Password: string(hash),
	})

	if err != nil {
		return "", err
	}

	return res.GetId(), nil
}