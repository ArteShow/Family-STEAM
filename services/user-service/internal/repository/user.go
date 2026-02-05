package repository

import (
	"context"

	"github.com/ArteShow/Family-STEAM/services/user-service/internal/db"
	"github.com/ArteShow/Family-STEAM/services/user-service/pkg/hashing"
	"github.com/ArteShow/Family-STEAM/services/user-service/pkg/uuid"
)

type User struct {
	ID        string
	Username  string
	Password  string
	CreatedAt string
}

func CreateUser(ctx context.Context, u User) (string, error) {
	db, err := db.Connect()
	if err != nil {
		return "", err
	}

	hash, err := hashing.HashPassword(u.Password)
	if err != nil {
		return "", err
	}

	id := uuid.CreateUUID()

	_, err = db.ExecContext(
		ctx,
		`INSERT INTO users (id, username, password) VALUES ($1, $2, $3)`,
		id,
		u.Username,
		hash,
	)
	return id, err
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
        `SELECT id, username, password, created_at FROM users WHERE username = $1`,
        username,
    ).Scan(
        &u.ID,
        &u.Username,
        &u.Password,
        &u.CreatedAt,
    )
    if err != nil {
        return User{}, err
    }

    if ok := hashing.ComparePasswords(password, []byte(u.Password)); !ok {
		return User{}, err
	}

    return u, nil
}

