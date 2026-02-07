package client

import (
	"context"
	"time"

	pb "github.com/ArteShow/Family-STEAM/services/news-service/internal/proto"
	"google.golang.org/grpc"
)

func IsUserTheAdmin(userID string) (bool, error) {
	conn, err := grpc.Dial("user-service:50001", grpc.WithInsecure())
	if err != nil {
		return false, err
	}
	defer conn.Close()

	client := pb.NewUserServiceClient(conn)

	req := &pb.IsUserTheAdminRequest{UserID: userID}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	res, err := client.IsUserTheAdmin(ctx, req)
	if err != nil {
		return false, err
	}

	return res.Ok, nil
}