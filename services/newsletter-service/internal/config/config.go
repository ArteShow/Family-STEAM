package config

import "github.com/ilyakaznacheev/cleanenv"

type Config struct {
	Port       string `env:"NEWSLETTER_SERVICE_PORT" env-default:":8008"`
	DBHost     string `env:"POSTGRES_HOST"           env-default:"postgres"`
	DBPort     string `env:"POSTGRES_PORT"           env-default:"5432"`
	DBUser     string `env:"POSTGRES_USER"           env-default:"postgres"`
	DBPassword string `env:"POSTGRES_PASSWORD"       env-default:"dev_only"`
	DBName     string `env:"POSTGRES_DB"             env-default:"family_steam_db"`
	SMTPHost   string `env:"SMTP_HOST"               env-default:"smtp.gmail.com"`
	SMTPPort   string `env:"SMTP_PORT"               env-default:"587"`
	SMTPUser   string `env:"SMTP_USER"               env-default:""`
	SMTPPass   string `env:"SMTP_PASS"               env-default:""`
	SMTPFrom   string `env:"SMTP_FROM"               env-default:"Family STEAM"`
}

func LoadConfig() (*Config, error) {
	cfg := &Config{}
	if err := cleanenv.ReadEnv(cfg); err != nil {
		return nil, err
	}
	return cfg, nil
}
