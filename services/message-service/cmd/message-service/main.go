package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Define routes for message service
	r.GET("/messages", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get all messages"})
	})

	r.POST("/messages", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Create a new message"})
	})

	r.GET("/messages/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get message by ID"})
	})

	r.PUT("/messages/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Update message"})
	})

	r.DELETE("/messages/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Delete message"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Message service running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start message service:", err)
	}
}