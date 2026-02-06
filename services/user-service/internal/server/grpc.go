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

func (s *Server) CreateClient(ctx context.Context, req *user_pb.CreateClientRequest) (*user_pb.CreateClientResponse, error) {
	id, err := repository.CreateClient(ctx, repository.Client{
		Name:       req.GetName(),
		FamilyName: req.GetFamilyName(),
		BirthDate:  req.GetBirthDate(),
		Email:      req.GetEmail(),
		Number:     req.GetNumber(),
		Type:       req.GetType(),
	})
	if err != nil {
		return &user_pb.CreateClientResponse{}, err
	}

	return &user_pb.CreateClientResponse{
		Id: id,
	}, nil
}

func (s *Server) GetClientByID(ctx context.Context, req *user_pb.GetClientByIDRequest) (*user_pb.GetClientByIDResponse, error) {
	client, err := repository.GetClientByID(ctx, req.GetId())
	if err != nil {
		return &user_pb.GetClientByIDResponse{}, err
	}

	return &user_pb.GetClientByIDResponse{
		Client: &user_pb.Client{
			Id:         client.ID,
			Name:       client.Name,
			FamilyName: client.FamilyName,
			BirthDate:  client.BirthDate,
			Email:      client.Email,
			Number:     client.Number,
			Type:       client.Type,
			CreatedAt:  client.CreatedAt,
		},
	}, nil
}

func (s *Server) GetAllClients(ctx context.Context, _ *user_pb.GetAllClientsRequest) (*user_pb.GetAllClientsResponse, error) {
	clients, err := repository.GetAllClients(ctx)
	if err != nil {
		return &user_pb.GetAllClientsResponse{}, err
	}

	var responseClients []*user_pb.Client

	for _, c := range clients {
		responseClients = append(responseClients, &user_pb.Client{
			Id:         c.ID,
			Name:       c.Name,
			FamilyName: c.FamilyName,
			BirthDate:  c.BirthDate,
			Email:      c.Email,
			Number:     c.Number,
			Type:       c.Type,
			CreatedAt:  c.CreatedAt,
		})
	}

	return &user_pb.GetAllClientsResponse{
		Clients: responseClients,
	}, nil
}

func (s *Server) DeleteClient(ctx context.Context, req *user_pb.DeleteClientRequest) (*user_pb.DeleteClientResponse, error) {
	err := repository.DeleteClient(ctx, req.GetId())
	if err != nil {
		return &user_pb.DeleteClientResponse{Success: false}, err
	}

	return &user_pb.DeleteClientResponse{
		Success: true,
	}, nil
}
