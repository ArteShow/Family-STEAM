package main

import (
	"context"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"

	"github.com/ArteShow/Family-STEAM/services/user-service/internal/config"
	userpb "github.com/ArteShow/Family-STEAM/services/user-service/internal/proto"
	grpcserver "github.com/ArteShow/Family-STEAM/services/user-service/internal/server"
	"google.golang.org/grpc"
)

func main() {
	cfg, err := config.Read()
	if err != nil {
		log.Fatal(err)
	}

	listener, err := net.Listen("tcp", ":"+cfg.GRPCServerPort)
	if err != nil {
		log.Fatal(err)
	}

	srv := grpc.NewServer()
	userpb.RegisterUserServiceServer(srv, grpcserver.NewServer())

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		log.Printf("User service gRPC running on port %s", cfg.GRPCServerPort)
		if err := srv.Serve(listener); err != nil {
			log.Printf("User service stopped: %v", err)
		}
	}()

	<-ctx.Done()
	srv.GracefulStop()
	log.Println("User service shutdown complete")
}
