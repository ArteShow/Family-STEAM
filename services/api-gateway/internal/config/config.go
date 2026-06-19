package config

import "github.com/ilyakaznacheev/cleanenv"

type Config struct {
	Port                 string `env:"API_GATEWAY_PORT" env-default:":8000"`
	APIVersion           string `env:"API_VERSION" env-default:"v1"`
	AuthServiceURL       string `env:"AUTH_SERVICE_URL" env-default:"http://auth-service:8001"`
	UserServiceURL       string `env:"USER_SERVICE_URL" env-default:"user-service:50002"`
	FileServiceURL       string `env:"FILE_SERVICE_URL" env-default:"http://file-service:8003"`
	ClientServiceURL     string `env:"CLIENT_SERVICE_URL" env-default:"http://client-service:8004"`
	CalendarServiceURL   string `env:"CALENDAR_SERVICE_URL" env-default:"http://calendar-service:8005"`
	TicketServiceURL     string `env:"TICKET_SERVICE_URL" env-default:"http://ticket-service:8006"`
	MessageServiceURL    string `env:"MESSAGE_SERVICE_URL" env-default:"http://message-service:8007"`
	NewsletterServiceURL string `env:"NEWSLETTER_SERVICE_URL" env-default:"http://newsletter-service:8008"`
	ReviewServiceURL     string `env:"REVIEW_SERVICE_URL" env-default:"http://review-service:8009"`
}

func Read() (*Config, error) {
	cfg := Config{}
	if err := cleanenv.ReadEnv(&cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}
