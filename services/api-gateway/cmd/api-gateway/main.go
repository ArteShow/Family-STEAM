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

	authRegisterProxy := proxy.NewProxy("http://auth-service:8001", "/auth-service/register")
	authLoginProxy := proxy.NewProxy("http://auth-service:8001", "/auth-service/login")
	authVerifyProxy := proxy.NewProxy("http://auth-service:8001", "/auth-service/verify")
	authUserRegisterProxy := proxy.NewProxy("http://auth-service:8001", "/auth-service/user-register")

	fileUploadProxy := proxy.NewProxy("http://file-service:8003", "/file-service/upload")
	fileDownloadProxy := proxy.NewProxy("http://file-service:8003", "/file-service/download")
	fileDeleteProxy := proxy.NewProxy("http://file-service:8003", "/file-service/delete")
	fileListProxy := proxy.NewProxy("http://file-service:8003", "/file-service/list")

	clientCreateProxy := proxy.NewProxy("http://client-service:8004", "/client-service/create")
	clientDeleteProxy := proxy.NewProxy("http://client-service:8004", "/client-service/delete")
	clientGetProxy := proxy.NewProxy("http://client-service:8004", "/client-service/get")
	clientUpdateProxy := proxy.NewProxy("http://client-service:8004", "/client-service/update")
	clientListProxy := proxy.NewProxy("http://client-service:8004", "/client-service/list")

	calenderCreateProxy := proxy.NewProxy("http://calender-service:8005", "/calender-service/create")
	calenderDeleteProxy := proxy.NewProxy("http://calender-service:8005", "/calender-service/delete")
	calenderGetProxy := proxy.NewProxy("http://calender-service:8005", "/calender-service/get")
	calenderGetAllProxy := proxy.NewProxy("http://calender-service:8005", "/calender-service/getAll")
	calenderUpdateImagesProxy := proxy.NewProxy("http://calender-service:8005", "/calender-service/update-images")
	calenderUpdateProxy := proxy.NewProxy("http://calender-service:8005", "/calender-service/update")

	ticketCreateProxy := proxy.NewProxy("http://ticket-service:8006", "/ticket-service/create")
	ticketGetAllProxy := proxy.NewProxy("http://ticket-service:8006", "/ticket-service/getAll")
	ticketGetByEmailProxy := proxy.NewProxy("http://ticket-service:8006", "/ticket-service/getByEmail")
	ticketGetByUserProxy := proxy.NewProxy("http://ticket-service:8006", "/ticket-service/getByUser")
	ticketRespondProxy := proxy.NewProxy("http://ticket-service:8006", "/ticket-service/respond")
	ticketCloseProxy := proxy.NewProxy("http://ticket-service:8006", "/ticket-service/close")
	ticketDeleteProxy := proxy.NewProxy("http://ticket-service:8006", "/ticket-service/delete")

	// message-service proxies (port 8007)
	msgAdminSendProxy := proxy.NewProxy("http://message-service:8007", "/message-service/adminSend")
	msgAdminInboxProxy := proxy.NewProxy("http://message-service:8007", "/message-service/adminInbox")
	msgAdminThreadProxy := proxy.NewProxy("http://message-service:8007", "/message-service/adminThread")
	msgAdminDeleteProxy := proxy.NewProxy("http://message-service:8007", "/message-service/adminDelete")
	msgUserReplyProxy := proxy.NewProxy("http://message-service:8007", "/message-service/userReply")
	msgUserInboxProxy := proxy.NewProxy("http://message-service:8007", "/message-service/userInbox")
	msgUserThreadProxy := proxy.NewProxy("http://message-service:8007", "/message-service/userThread")
	msgMarkReadProxy := proxy.NewProxy("http://message-service:8007", "/message-service/markRead")

	// newsletter-service proxies (port 8008)
	nlSubscribeProxy := proxy.NewProxy("http://newsletter-service:8008", "/newsletter-service/subscribe")
	nlUnsubscribeProxy := proxy.NewProxy("http://newsletter-service:8008", "/newsletter-service/unsubscribe")
	nlSubscribersProxy := proxy.NewProxy("http://newsletter-service:8008", "/newsletter-service/subscribers")
	nlSendProxy := proxy.NewProxy("http://newsletter-service:8008", "/newsletter-service/send")
	nlCampaignsProxy := proxy.NewProxy("http://newsletter-service:8008", "/newsletter-service/campaigns")

	// review-service proxies (port 8009)
	reviewCreateProxy := proxy.NewProxy("http://review-service:8009", "/review-service/create")
	reviewAdminCreateProxy := proxy.NewProxy("http://review-service:8009", "/review-service/adminCreate")
	reviewGetByCalendarProxy := proxy.NewProxy("http://review-service:8009", "/review-service/getByCalendar")
	reviewDeleteProxy := proxy.NewProxy("http://review-service:8009", "/review-service/delete")
	reviewCheckEligibleProxy := proxy.NewProxy("http://review-service:8009", "/review-service/checkEligible")

	handler := http.NewServeMux()
	handler.Handle(
		"/api/"+cfg.APIVersion+"/api-gateway/health",
		middleware.LoggingMiddleware(
			http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
				_, err := w.Write([]byte("ok"))
				if err != nil {
					http.Error(w, "failed to write status ok", http.StatusInternalServerError)
				}
			}),
		),
	)

	handler.Handle("/api/"+cfg.APIVersion+"/auth/register", middleware.LoggingMiddleware(authRegisterProxy))
	handler.Handle("/api/"+cfg.APIVersion+"/auth/login", middleware.LoggingMiddleware(authLoginProxy))
	handler.Handle("/api/"+cfg.APIVersion+"/auth/verify", middleware.LoggingMiddleware(authVerifyProxy))
	handler.Handle("/api/"+cfg.APIVersion+"/auth/user-register", middleware.LoggingMiddleware(authUserRegisterProxy))

	handler.Handle("/api/"+cfg.APIVersion+"/file/download", middleware.LoggingMiddleware(fileDownloadProxy))
	handler.Handle("/api/"+cfg.APIVersion+"/file/upload", middleware.LoggingMiddleware(middleware.AdminOnly(fileUploadProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/file/delete", middleware.LoggingMiddleware(middleware.AdminOnly(fileDeleteProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/file/list", middleware.LoggingMiddleware(fileListProxy))

	handler.Handle("/api/"+cfg.APIVersion+"/client/create", middleware.LoggingMiddleware(clientCreateProxy))
	handler.Handle("/api/"+cfg.APIVersion+"/client/delete", middleware.LoggingMiddleware(middleware.AdminOnly(clientDeleteProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/client/get", middleware.LoggingMiddleware(middleware.AdminOnly(clientGetProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/client/update", middleware.LoggingMiddleware(middleware.AdminOnly(clientUpdateProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/client/list", middleware.LoggingMiddleware(middleware.AdminOnly(clientListProxy)))

	handler.Handle("/api/"+cfg.APIVersion+"/calender/create", middleware.LoggingMiddleware(middleware.AdminOnly(calenderCreateProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/calender/delete", middleware.LoggingMiddleware(middleware.AdminOnly(calenderDeleteProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/calender/update-images", middleware.LoggingMiddleware(middleware.AdminOnly(calenderUpdateImagesProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/calender/update", middleware.LoggingMiddleware(middleware.AdminOnly(calenderUpdateProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/calender/get", middleware.LoggingMiddleware(calenderGetProxy))
	handler.Handle("/api/"+cfg.APIVersion+"/calender/getAll", middleware.LoggingMiddleware(calenderGetAllProxy))

	handler.Handle("/api/"+cfg.APIVersion+"/ticket/create", middleware.LoggingMiddleware(middleware.UserAuth(ticketCreateProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/ticket/getByEmail", middleware.LoggingMiddleware(middleware.AdminOnly(ticketGetByEmailProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/ticket/getByUser", middleware.LoggingMiddleware(middleware.UserAuth(ticketGetByUserProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/ticket/close", middleware.LoggingMiddleware(middleware.UserAuth(ticketCloseProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/ticket/getAll", middleware.LoggingMiddleware(middleware.AdminOnly(ticketGetAllProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/ticket/respond", middleware.LoggingMiddleware(middleware.AdminOnly(ticketRespondProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/ticket/delete", middleware.LoggingMiddleware(middleware.AdminOnly(ticketDeleteProxy)))

	// message-service routes
	handler.Handle("/api/"+cfg.APIVersion+"/message/adminSend", middleware.LoggingMiddleware(middleware.AdminOnly(msgAdminSendProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/message/adminInbox", middleware.LoggingMiddleware(middleware.AdminOnly(msgAdminInboxProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/message/adminThread", middleware.LoggingMiddleware(middleware.AdminOnly(msgAdminThreadProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/message/adminDelete", middleware.LoggingMiddleware(middleware.AdminOnly(msgAdminDeleteProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/message/userReply", middleware.LoggingMiddleware(middleware.UserAuth(msgUserReplyProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/message/userInbox", middleware.LoggingMiddleware(middleware.UserAuth(msgUserInboxProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/message/userThread", middleware.LoggingMiddleware(middleware.UserAuth(msgUserThreadProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/message/markRead", middleware.LoggingMiddleware(middleware.UserAuth(msgMarkReadProxy)))

	// newsletter-service routes
	handler.Handle("/api/"+cfg.APIVersion+"/newsletter/subscribe", middleware.LoggingMiddleware(nlSubscribeProxy))
	handler.Handle("/api/"+cfg.APIVersion+"/newsletter/unsubscribe", middleware.LoggingMiddleware(nlUnsubscribeProxy))
	handler.Handle("/api/"+cfg.APIVersion+"/newsletter/subscribers", middleware.LoggingMiddleware(middleware.AdminOnly(nlSubscribersProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/newsletter/send", middleware.LoggingMiddleware(middleware.AdminOnly(nlSendProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/newsletter/campaigns", middleware.LoggingMiddleware(middleware.AdminOnly(nlCampaignsProxy)))

	// review-service routes
	handler.Handle("/api/"+cfg.APIVersion+"/review/create", middleware.LoggingMiddleware(middleware.UserAuth(reviewCreateProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/review/adminCreate", middleware.LoggingMiddleware(middleware.AdminOnly(reviewAdminCreateProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/review/getByCalendar", middleware.LoggingMiddleware(reviewGetByCalendarProxy))
	handler.Handle("/api/"+cfg.APIVersion+"/review/delete", middleware.LoggingMiddleware(middleware.AdminOnly(reviewDeleteProxy)))
	handler.Handle("/api/"+cfg.APIVersion+"/review/checkEligible", middleware.LoggingMiddleware(middleware.UserAuth(reviewCheckEligibleProxy)))

	srv := &http.Server{
		Addr:         cfg.Port,
		Handler:      middleware.CORSMiddleware(handler),
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
