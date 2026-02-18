package main

import (
	"log"
	"net"
	"os"
	"os/signal"

	"github.com/ArteShow/Family-STEAM/services/user-service/internal/config"
	"github.com/ArteShow/Family-STEAM/services/user-service/internal/proto"
	grpc_server "github.com/ArteShow/Family-STEAM/services/user-service/internal/server"
	"google.golang.org/grpc"
)

func main() {
	cfg, err := config.Read()
	if err != nil {
		log.Fatal(err)
	}

	grpcLis, err := net.Listen("tcp", ":"+cfg.GRPCServerPort)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	proto.RegisterUserServiceServer(grpcServer, grpc_server.NewServer())

	go func() {
		log.Println("gRPC server running on :" + cfg.GRPCServerPort)
		if err := grpcServer.Serve(grpcLis); err != nil {
			log.Printf("gRPC server stopped: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("Shutting down server...")

	grpcServer.GracefulStop()

	log.Println("Server stopped")
}
