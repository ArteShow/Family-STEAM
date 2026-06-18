package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Define routes for user service
	r.GET("/users", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get all users"})
	})

	r.POST("/users", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Create a new user"})
	})

	r.GET("/users/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get user by ID"})
	})

	r.PUT("/users/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Update user"})
	})

	r.DELETE("/users/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Delete user"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("User service running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start user service:", err)
	}
}