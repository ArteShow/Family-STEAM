package config

import "github.com/ilyakaznacheev/cleanenv"

type Config struct {
	Port             string `env:"REVIEW_SERVICE_PORT" env-default:":8009"`
	DBHost           string `env:"POSTGRES_HOST" env-default:"postgres"`
	DBPort           string `env:"POSTGRES_PORT" env-default:"5432"`
	DBUser           string `env:"POSTGRES_USER" env-default:"postgres"`
	DBPassword       string `env:"POSTGRES_PASSWORD" env-default:"dev_only"`
	DBName           string `env:"POSTGRES_DB" env-default:"family_steam_db"`
	ClientServiceURL string `env:"CLIENT_SERVICE_URL" env-default:"http://client-service:8004"`
}

func Read() (*Config, error) {
	cfg := Config{}
	if err := cleanenv.ReadEnv(&cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}
