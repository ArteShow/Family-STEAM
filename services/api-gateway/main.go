
package main

import (
	"context"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"time"
)

func main() {
	// Health check endpoint
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	// Healthy endpoint
	http.HandleFunc("/healthy", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	// API Gateway health endpoint
	http.HandleFunc("/api/v1/api-gateway/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	// Proxy routes to services
	// Create a reverse proxy for each service
	proxyHandler := func(serviceURL string) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			// Parse the target URL
			targetURL, err := url.Parse(serviceURL)
			if err != nil {
				http.Error(w, "Invalid service URL", http.StatusInternalServerError)
				return
			}

			// Create a new reverse proxy
			proxy := httputil.NewSingleHostReverseProxy(targetURL)

			// Modify the request to point to the target service
			r.URL.Scheme = targetURL.Scheme
			r.URL.Host = targetURL.Host
			r.Header.Set("X-Forwarded-Host", r.Header.Get("Host"))
			r.Header.Set("X-Origin-Host", targetURL.Host)

			// Add timeout to prevent hanging requests
			ctx, cancel := context.WithTimeout(r.Context(), 30*time.Second)
			defer cancel()
			
			r = r.WithContext(ctx)

			// Forward the request
			proxy.ServeHTTP(w, r)
		}
	}

	// Route API calls to appropriate services
	http.HandleFunc("/api/v1/users/", proxyHandler("http://user-service:50002"))
	http.HandleFunc("/api/v1/auth/", proxyHandler("http://auth-service:8001"))
	http.HandleFunc("/api/v1/files/", proxyHandler("http://file-service:8003"))
	http.HandleFunc("/api/v1/clients/", proxyHandler("http://client-service:8004"))
	http.HandleFunc("/api/v1/calendar/", proxyHandler("http://calendar-service:8005"))
	http.HandleFunc("/api/v1/tickets/", proxyHandler("http://ticket-service:8006"))
	http.HandleFunc("/api/v1/messages/", proxyHandler("http://message-service:8007"))
	http.HandleFunc("/api/v1/newsletters/", proxyHandler("http://newsletter-service:8008"))
	http.HandleFunc("/api/v1/reviews/", proxyHandler("http://review-service:8009"))
	
	// Fallback for other API routes
	http.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("API endpoint not found"))
	})

  port := os.Getenv("API_GATEWAY_PORT")
  if port == "" {
    port = "8000"
  }

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
