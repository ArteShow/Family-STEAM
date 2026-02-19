package grpc_server

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
	id, err := repository.CreateUser(req.GetUsername(), req.GetPassword())
	if err != nil {
		return &user_pb.SaveUserResponse{}, err
	}

	return &user_pb.SaveUserResponse{
		Id:      id,
		Success: true,
	}, nil
}

func (s *Server) GetUserPassword(_ context.Context, req *user_pb.CompareLoginPasswordRequest) (*user_pb.CompareLoginPasswordResponse, error) {
	success := repository.CheckUserLogin(req.GetUsername(), req.GetPassword())
	if !success {
		return &user_pb.CompareLoginPasswordResponse{}, nil
	}

	return &user_pb.CompareLoginPasswordResponse{
		Success: success,
	}, nil
}

func (s *Server) CheckUserId(_ context.Context, req *user_pb.CheckUserIdRequest) (*user_pb.CheckUserIdResponse, error) {
	success := repository.CheckUsersID(req.GetUsername(), req.GetId())
	if !success {
		return &user_pb.CheckUserIdResponse{Success: success}, nil
	}

	return &user_pb.CheckUserIdResponse{
		Success: success,
	}, nil
}