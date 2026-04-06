package database

import (
	"database/sql"
	"sync"
	"time"

	"github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/config"
	_ "github.com/lib/pq"
)

var (
	once    sync.Once
	db      *sql.DB
	initErr error
)

func Connect() (*sql.DB, error) {
	once.Do(func() {
		cfg, err := config.LoadConfig()
		if err != nil {
			initErr = err
			return
		}

		connStr :=
			"host=" + cfg.DBHost +
				" port=" + cfg.DBPort +
				" user=" + cfg.DBUser +
				" password=" + cfg.DBPassword +
				" dbname=" + cfg.DBName +
				" sslmode=disable"

		d, err := sql.Open("postgres", connStr)
		if err != nil {
			initErr = err
			return
		}

		d.SetMaxOpenConns(10)
		d.SetMaxIdleConns(5)
		d.SetConnMaxLifetime(5 * time.Minute)

		if err = d.Ping(); err != nil {
			initErr = err
			return
		}

		db = d
	})
	return db, initErr
}
