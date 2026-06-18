package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Define routes for calendar service
	r.GET("/events", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get all events"})
	})

	r.POST("/events", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Create a new event"})
	})

	r.GET("/events/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get event by ID"})
	})

	r.PUT("/events/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Update event"})
	})

	r.DELETE("/events/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Delete event"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Calendar service running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start calendar service:", err)
	}
}