package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ArteShow/Family-STEAM/services/api-gateway/internal/config"
	"github.com/ArteShow/Family-STEAM/services/api-gateway/internal/middleware"
	"github.com/ArteShow/Family-STEAM/services/api-gateway/internal/proxy"
)

const (
	readTimeout  = 10 * time.Second
	writeTimeout = 10 * time.Second
	idleTimeou   = 60 * time.Second
)

func main() {
	cfg, err := config.Read()
	if err != nil {
		log.Fatal(err)
	}

	if cfg.Port != "" && cfg.Port[0] != ':' {
		cfg.Port = ":" + cfg.Port
	}

	registerProxy := proxy.NewProxy("http://auth-service:8003", "/auth-service/register")
	loginProxy := proxy.NewProxy("http://auth-service:8003", "/auth-service/login")

	createCalenderProxy := proxy.NewProxy("http://calender-service:8001", "/calender-service/create")
	deleteCalenderProxy := proxy.NewProxy("http://calender-service:8001", "/calender-service/delete")
	getAllCalenderProxy := proxy.NewProxy("http://calender-service:8001", "/calender-service/get_all")
	getByIDCalenderProxy := proxy.NewProxy("http://calender-service:8001", "/calender-service/get_by_id")
	updateCalenderProxy := proxy.NewProxy("http://calender-service:8001", "/calender-service/update")

	createCampProxy := proxy.NewProxy("http://camp-service:8004", "/camp-service/create")
	deleteCampProxy := proxy.NewProxy("http://camp-service:8004", "/camp-service/delete")
	getAllCampProxy := proxy.NewProxy("http://camp-service:8004", "/camp-service/get_all")
	getByIDCampProxy := proxy.NewProxy("http://camp-service:8004", "/camp-service/get_by_id")
	updateCampProxy := proxy.NewProxy("http://camp-service:8004", "/camp-service/update")

	uploadFileProxy := proxy.NewProxy("http://file-service:8005", "/file-service/upload")
	downloadFileProxy := proxy.NewProxy("http://file-service:8005", "/file-service/download")
	getAllFilesProxy := proxy.NewProxy("http://file-service:8005", "/file-service/get_all")
	getFileByIDProxy := proxy.NewProxy("http://file-service:8005", "/file-service/get_by_id")
	
	createClientProxy := proxy.NewProxy("http://user-service:8002", "/user-service/create")
	deleteClientProxy := proxy.NewProxy("http://user-service:8002", "/user-service/delete")
	getAllClientsProxy := proxy.NewProxy("http://user-service:8002", "/user-service/get_all")
	getClientByIDProxy := proxy.NewProxy("http://user-service:8002", "/user-service/get_by_id")

	creatEventProxy := proxy.NewProxy("http://event-service:8006", "/event-service/create")
	deleteEventProxy := proxy.NewProxy("http://event-service:8006", "/event-service/delete")
	getAllEventProxy := proxy.NewProxy("http://event-service:8006", "/event-service/get_all")
	getByIDEventProxy := proxy.NewProxy("http://event-service:8006", "/event-service/get_by_id")
	updateEventProxy := proxy.NewProxy("http://event-service:8006", "/event-service/update")

	createNewsProxy := proxy.NewProxy("http://news-service:8007", "/news-service/create")
	deleteNewsProxy := proxy.NewProxy("http://news-service:8007", "/news-service/delete")
	getAllNewsProxy := proxy.NewProxy("http://news-service:8007", "/news-service/get_all")
	getNewsByIDProxy := proxy.NewProxy("http://news-service:8007", "/news-service/get_by_id")
	
	handler := http.NewServeMux()
	handler.Handle(
		"/api/v1/api-gateway/health",
		middleware.LogMiddleware(
			http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
				_, err := w.Write([]byte("ok"))
				if err != nil {
					http.Error(w, "failed to write status ok", http.StatusInternalServerError)
				}
			}),
		),
	)
	handler.Handle("/api/v1/auth/register", middleware.LogMiddleware(registerProxy))
	handler.Handle("/api/v1/auth/login", middleware.LogMiddleware(loginProxy))

	handler.Handle("/api/v1/calender/create", middleware.LogMiddleware(middleware.AuthMiddleware()(createCalenderProxy)))
	handler.Handle("/api/v1/calender/delete", middleware.LogMiddleware(middleware.AuthMiddleware()(deleteCalenderProxy)))
	handler.Handle("/api/v1/calender/get_all", middleware.LogMiddleware(middleware.AuthMiddleware()(getAllCalenderProxy)))
	handler.Handle("/api/v1/calender/get_by_id", middleware.LogMiddleware(middleware.AuthMiddleware()(getByIDCalenderProxy)))
	handler.Handle("/api/v1/calender/update", middleware.LogMiddleware(middleware.AuthMiddleware()(updateCalenderProxy)))

	handler.Handle("/api/v1/camp/create", middleware.LogMiddleware(middleware.AuthMiddleware()(createCampProxy)))
	handler.Handle("/api/v1/camp/delete", middleware.LogMiddleware(middleware.AuthMiddleware()(deleteCampProxy)))
	handler.Handle("/api/v1/camp/get_all", middleware.LogMiddleware(middleware.AuthMiddleware()(getAllCampProxy)))
	handler.Handle("/api/v1/camp/get_by_id", middleware.LogMiddleware(middleware.AuthMiddleware()(getByIDCampProxy)))
	handler.Handle("/api/v1/camp/update", middleware.LogMiddleware(middleware.AuthMiddleware()(updateCampProxy)))

	handler.Handle("/api/v1/file/upload", middleware.LogMiddleware(middleware.AuthMiddleware()(uploadFileProxy)))
	handler.Handle("/api/v1/file/download", middleware.LogMiddleware(middleware.AuthMiddleware()(downloadFileProxy)))
	handler.Handle("/api/v1/file/get_all", middleware.LogMiddleware(middleware.AuthMiddleware()(getAllFilesProxy)))
	handler.Handle("/api/v1/file/get_by_id", middleware.LogMiddleware(middleware.AuthMiddleware()(getFileByIDProxy)))
	
	handler.Handle("/api/v1/client/create", middleware.LogMiddleware(middleware.AuthMiddleware()(createClientProxy)))
	handler.Handle("/api/v1/client/delete", middleware.LogMiddleware(middleware.AuthMiddleware()(deleteClientProxy)))
	handler.Handle("/api/v1/client/get_all", middleware.LogMiddleware(middleware.AuthMiddleware()(getAllClientsProxy)))
	handler.Handle("/api/v1/client/get_by_id", middleware.LogMiddleware(middleware.AuthMiddleware()(getClientByIDProxy)))

	handler.Handle("/api/v1/event/create", middleware.LogMiddleware(middleware.AuthMiddleware()(creatEventProxy)))
	handler.Handle("/api/v1/event/delete", middleware.LogMiddleware(middleware.AuthMiddleware()(deleteEventProxy)))
	handler.Handle("/api/v1/event/get_all", middleware.LogMiddleware(middleware.AuthMiddleware()(getAllEventProxy)))
	handler.Handle("/api/v1/event/get_by_id", middleware.LogMiddleware(middleware.AuthMiddleware()(getByIDEventProxy)))
	handler.Handle("/api/v1/event/update", middleware.LogMiddleware(middleware.AuthMiddleware()(updateEventProxy)))

	handler.Handle("/api/v1/news/create", middleware.LogMiddleware(middleware.AuthMiddleware()(createNewsProxy)))
	handler.Handle("/api/v1/news/delete", middleware.LogMiddleware(middleware.AuthMiddleware()(deleteNewsProxy)))
	handler.Handle("/api/v1/news/get_all", middleware.LogMiddleware(getAllNewsProxy))
	handler.Handle("/api/v1/news/get_by_id", middleware.LogMiddleware(getNewsByIDProxy))

	srv := &http.Server{
		Addr:         cfg.Port,
		Handler:      handler,
		ReadTimeout:  readTimeout,
		WriteTimeout: writeTimeout,
		IdleTimeout:  idleTimeou,
	}

	ctx, stop := signal.NotifyContext(
		context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
	)
	defer stop()

	go func() {
		log.Println("gateway running on " + cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	<-ctx.Done()

	log.Println("graceful shutdown started")

	shutdownCtx, cancel := context.WithTimeout(
		context.Background(),
		10*time.Second,
	)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("shutdown failed: %v", err)
	}

	log.Println("shutdown complete")
}
