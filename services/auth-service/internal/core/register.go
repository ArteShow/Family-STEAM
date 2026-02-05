package core

import (
	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/client"
	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/proto"
)

func Register(username, password string) (string, error) {
	client, err := client.NewUserClient()
	if err != nil {
		return "", err
	}
	defer client.Close()

	res, err := client.SaveUser(&proto.SaveUserRequest{
		Username: username,
		Password: password,
	})

	if err != nil {
		return "", err
	}

	return res.GetId(), nil
}