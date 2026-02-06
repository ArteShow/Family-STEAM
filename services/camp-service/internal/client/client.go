package client

import (
	"context"
	"time"

	pb "github.com/ArteShow/Family-STEAM/services/camp-service/internal/proto"
	"google.golang.org/grpc"
)

func CreateClient(name, familyName, birthDate, email, number, clientType string) (string, error) {
	conn, err := grpc.Dial("user-service:8002", grpc.WithInsecure())
	if err != nil {
		return "", err
	}
	defer conn.Close()

	client := pb.NewUserServiceClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	res, err := client.CreateClient(ctx, &pb.CreateClientRequest{
		Name:       name,
		FamilyName: familyName,
		BirthDate:  birthDate,
		Email:      email,
		Number:     number,
		Type:       clientType,
	})
	if err != nil {
		return "", err
	}

	return res.Id, nil
}

func GetClientByID(id string) (*pb.Client, error) {
	conn, err := grpc.Dial("user-service:8002", grpc.WithInsecure())
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	client := pb.NewUserServiceClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	res, err := client.GetClientByID(ctx, &pb.GetClientByIDRequest{Id: id})
	if err != nil {
		return nil, err
	}

	return res.Client, nil
}

func GetAllClients() ([]*pb.Client, error) {
	conn, err := grpc.Dial("user-service:8002", grpc.WithInsecure())
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	client := pb.NewUserServiceClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	res, err := client.GetAllClients(ctx, &pb.GetAllClientsRequest{})
	if err != nil {
		return nil, err
	}

	return res.Clients, nil
}

func DeleteClient(id string) (bool, error) {
	conn, err := grpc.Dial("user-service:8002", grpc.WithInsecure())
	if err != nil {
		return false, err
	}
	defer conn.Close()

	client := pb.NewUserServiceClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	res, err := client.DeleteClient(ctx, &pb.DeleteClientRequest{Id: id})
	if err != nil {
		return false, err
	}

	return res.Success, nil
}
