package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Define routes for client service
	r.GET("/clients", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get all clients"})
	})

	r.POST("/clients", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Create a new client"})
	})

	r.GET("/clients/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get client by ID"})
	})

	r.PUT("/clients/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Update client"})
	})

	r.DELETE("/clients/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Delete client"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Client service running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start client service:", err)
	}
}