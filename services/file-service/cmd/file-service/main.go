package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Define routes for file service
	r.POST("/files", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Upload a new file"})
	})

	r.GET("/files/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Get file by ID"})
	})

	r.DELETE("/files/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Delete file"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("File service running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start file service:", err)
	}
}