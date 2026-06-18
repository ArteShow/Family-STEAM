package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Define routes for auth service
	r.POST("/auth/register", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "User registered"})
	})

	r.POST("/auth/login", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "User logged in"})
	})

	r.GET("/auth/profile", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get user profile"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Auth service running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start auth service:", err)
	}
}