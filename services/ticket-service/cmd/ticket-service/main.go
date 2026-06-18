package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Define routes for ticket service
	r.GET("/tickets", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get all tickets"})
	})

	r.POST("/tickets", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Create a new ticket"})
	})

	r.GET("/tickets/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get ticket by ID"})
	})

	r.PUT("/tickets/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Update ticket"})
	})

	r.DELETE("/tickets/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Delete ticket"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Ticket service running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start ticket service:", err)
	}
}