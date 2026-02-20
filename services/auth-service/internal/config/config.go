package config

import "github.com/ilyakaznacheev/cleanenv"

type Config struct {
	Port      string `env:"AUTH_SERVICE_PORT" env-default:":8001"`
	JWTSecret string `env:"JWT_SECRET" env-default:"9f4d7c2a6e3b1a8f5c9d0e4b7a2f6c1d8e3b5a9f0c7d2e6b4a1f8c3d5e9b7a2
"`
}

func Read() (*Config, error) {
	cfg := Config{}
	if err := cleanenv.ReadEnv(&cfg); err != nil{
		return nil, err
	}

	return &cfg, nil
}