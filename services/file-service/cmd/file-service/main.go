package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ArteShow/Family-STEAM/services/file-service/internal/handlers"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/file-service/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("/file-service/upload", handlers.UploadHandler)
	mux.HandleFunc("/file-service/download", handlers.DownloadHandler)
	mux.HandleFunc("/file-service/delete", handlers.DeleteHandler)
	mux.HandleFunc("/file-service/list", handlers.ListHandler)

	port := os.Getenv("FILE_SERVICE_PORT")
	if port == "" {
		port = "8003"
	}

	log.Printf("File service running on port %s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal("Failed to start file service:", err)
	}
}
