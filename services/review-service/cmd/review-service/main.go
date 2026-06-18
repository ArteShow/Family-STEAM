package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Define routes for review service
	r.GET("/reviews", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get all reviews"})
	})

	r.POST("/reviews", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Create a new review"})
	})

	r.GET("/reviews/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get review by ID"})
	})

	r.PUT("/reviews/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Update review"})
	})

	r.DELETE("/reviews/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Delete review"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Review service running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start review service:", err)
	}
}