package core

import (
	"time"

	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/client"
	jwtutile "github.com/ArteShow/Family-STEAM/services/auth-service/internal/jwt"
	"github.com/ArteShow/Family-STEAM/services/auth-service/internal/proto"
	"github.com/ArteShow/Family-STEAM/services/auth-service/pkg/hashing"
)

func Login(username, password string) (string, error) {
	client, err := client.NewUserClient()
	if err != nil {
		return "", err
	}
	defer client.Close()

	hash, err := hashing.HashPassword(password)
	if err != nil {
		return "", err
	}

	res, err := client.GetUserPassword(&proto.GetUsersIDRequest{
		Username: username,
		Password: string(hash),
	})

	if err != nil {
		return "", err
	}

	token, err := jwtutile.GenerateToken(res.GetId(), time.Hour*1)
	if err != nil {
		return "", err
	}

	return token, nil
}