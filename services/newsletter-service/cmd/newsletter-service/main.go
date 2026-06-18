package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Define routes for newsletter service
	r.POST("/newsletter/subscribe", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "User subscribed to newsletter"})
	})

	r.POST("/newsletter/unsubscribe", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "User unsubscribed from newsletter"})
	})

	r.POST("/newsletter/send", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Newsletter sent"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Newsletter service running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start newsletter service:", err)
	}
}