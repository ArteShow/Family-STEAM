package server

import (
	"context"

	user_pb "github.com/ArteShow/Family-STEAM/services/user-service/internal/proto"
	"github.com/ArteShow/Family-STEAM/services/user-service/internal/repository"
)

type Server struct {
	user_pb.UnimplementedUserServiceServer
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) SaveUser(_ context.Context, req *user_pb.SaveUserRequest) (*user_pb.SaveUserResponse, error) {
	id, err := repository.CreateUser(context.Background(), repository.User{
		Username: req.GetUsername(),
		Password: req.GetPassword(),
	})
	if err != nil {
		return &user_pb.SaveUserResponse{}, err
	}

	return &user_pb.SaveUserResponse{
		Id:      id,
	}, nil
}

func (s *Server) GetUserPassword(_ context.Context, req *user_pb.GetUsersIDRequest) (*user_pb.GetUsersIDResponse, error) {
	user, err := repository.GetUserByPasswordAndUsername(context.Background(), req.GetUsername(), req.GetPassword())
	if err != nil {
		return &user_pb.GetUsersIDResponse{}, err
	}

	return &user_pb.GetUsersIDResponse{
		Id: user.ID,
	}, nil
}

func (s *Server) IsUserTheAdmin(_ context.Context, req *user_pb.IsUserTheAdminRequest) (*user_pb.IsUserTheAdminResponse, error) {
	user, err := repository.GetUserByID(context.Background(), req.GetUserID())
	if err != nil || user.Username == "" {
		return &user_pb.IsUserTheAdminResponse{
			Ok: false,
		}, err
	}

	return &user_pb.IsUserTheAdminResponse{
		Ok: true,
	}, nil
}