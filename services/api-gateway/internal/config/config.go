package config

import "github.com/ilyakaznacheev/cleanenv"

type Config struct {
	Port string `env:"API_GATEWAY_PORT" env-default:":8000"`
}

func Read() (*Config, error) {
	cfg := Config{}
	if err := cleanenv.ReadConfig(&cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}
