package client

import (
	"context"
	"errors"

	pb "github.com/ArteShow/Family-STEAM/services/auth-service/internal/proto"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type UserClient struct {
	Client pb.UserServiceClient
	Conn   *grpc.ClientConn
}

func NewUserClient() (*UserClient, error) {
	conn, err := grpc.Dial("user-service:50052", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, err
	}

	client := pb.NewUserServiceClient(conn)
	if client == nil {
		conn.Close()
		return nil, errors.New("failed to create NewUserClient")
	}

	return &UserClient{
		Client: client,
		Conn:   conn,
	}, nil
}

func (u *UserClient) Close() error {
	return u.Conn.Close()
}

func (u *UserClient) SaveUser(req *pb.SaveUserRequest) (*pb.SaveUserResponse, error) {
	res, err := u.Client.SaveUser(context.Background(), req)
	if err != nil {
		return &pb.SaveUserResponse{}, err
	}

	return res, nil
}

func (u *UserClient) CompareLoginPassword(req *pb.CompareLoginPasswordRequest) (*pb.CompareLoginPasswordResponse, error) {
	res, err := u.Client.CompareLoginPassword(context.Background(), req)
	if err != nil {
		return &pb.CompareLoginPasswordResponse{}, err
	}

	return res, nil
}

func (u *UserClient) CheckUserId(req *pb.CheckUserIdRequest) (*pb.CheckUserIdResponse, error) {
	res, err := u.Client.CheckUserId(context.Background(), req)
	if err != nil {
		return &pb.CheckUserIdResponse{}, err
	}
	
	return res, nil
}