package main

import (
	"context"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ArteShow/Family-STEAM/services/user-service/internal/config"
	userpb "github.com/ArteShow/Family-STEAM/services/user-service/internal/proto"
	"github.com/ArteShow/Family-STEAM/services/user-service/internal/server"
	"google.golang.org/grpc"
)

func main() {
	cfg, err := config.Read()
	if err != nil {
		log.Fatal(err)
	}

	lis, err := net.Listen("tcp", ":"+cfg.Port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	userpb.RegisterUserServiceServer(grpcServer, server.NewServer())

	go func() {
		log.Println("gRPC server running on :" + cfg.Port)
		if err := grpcServer.Serve(lis); err != nil {
			log.Printf("gRPC server stopped: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	sig := <-stop
	log.Printf("Received signal %s, shutting down...", sig)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	done := make(chan struct{})
	go func() {
		grpcServer.GracefulStop()
		close(done)
	}()

	select {
	case <-done:
		log.Println("gRPC server stopped gracefully")
	case <-ctx.Done():
		log.Println("timeout reached, forcing gRPC server stop")
		grpcServer.Stop()
	}

	log.Println("Shutdown complete")
}
