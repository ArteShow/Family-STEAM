package repository

import (
	"context"

	"github.com/ArteShow/Family-STEAM/services/user-service/internal/db"
)

type User struct {
	ID        string
	Username  string
	Password  string
	CreatedAt string
}

func CreateUser(ctx context.Context, u User) error {
	db, err := db.Connect()
	if err != nil {
		return err
	}

	_, err = db.ExecContext(
		ctx,
		`INSERT INTO users (id, username, password) VALUES ($1, $2, $3)`,
		u.ID,
		u.Username,
		u.Password,
	)
	return err
}

func DeleteUser(ctx context.Context, id string) error {
	db, err := db.Connect()
	if err != nil {
		return err
	}

	_, err = db.ExecContext(
		ctx,
		`DELETE FROM users WHERE id = $1`,
		id,
	)
	return err
}

func GetUserByID(ctx context.Context, id string) (User, error) {
	var u User

	db, err := db.Connect()
	if err != nil {
		return User{}, err
	}

	err = db.QueryRowContext(
		ctx,
		`SELECT id, username, password, created_at FROM users WHERE id = $1`,
		id,
	).Scan(
		&u.ID,
		&u.Username,
		&u.Password,
		&u.CreatedAt,
	)

	return u, err
}

func GetUserByPasswordAndUsername(ctx context.Context, username, password string) (User, error) {
	var u User

	db, err := db.Connect()
	if err != nil {
		return User{}, err
	}

	err = db.QueryRowContext(
		ctx,
		`SELECT id, username, password, created_at FROM users WHERE username = $1 AND password = $2`,
		username,
		password,
	).Scan(
		&u.ID,
		&u.Username,
		&u.Password,
		&u.CreatedAt,
	)

	return u, err
}
