package repository

import (
	"time"

	"github.com/ArteShow/Family-STEAM/services/user-service/internal/database"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(username string, password string) (string, error) {
	db, err := database.Connect()
	if err != nil {
		return "", err
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	id := uuid.New().String()

	_, err = db.Exec(
		`INSERT INTO users (id, username, password, created_at) 
		 VALUES ($1, $2, $3, $4)`,
		id,
		username,
		string(hash),
		time.Now(),
	)

	return id, err
}

func CheckUserLogin(username string, password string) bool {
	db, err := database.Connect()
	if err != nil {
		return false
	}

	var hash string

	err = db.QueryRow(
		`SELECT password FROM users WHERE username = $1`,
		username,
	).Scan(&hash)

	if err != nil {
		return false
	}

	err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func CheckUsersId(username string, id string) bool {
	db, err := database.Connect()
	if err != nil {
		return false
	}

	var hash string

	err = db.QueryRow(
		`SELECT id FROM users WHERE username = $1`,
		username,
	).Scan(&hash)

	if err != nil {
		return false
	}

	return true
}