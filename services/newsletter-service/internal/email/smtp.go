package email

import (
	"crypto/tls"
	"fmt"
	"net"
	"net/smtp"
	"strings"

	"github.com/ArteShow/Family-STEAM/services/newsletter-service/internal/config"
)

// SendNewsletter sends an HTML newsletter email to every recipient in the list.
func SendNewsletter(cfg *config.Config, recipients []string, subject, heading, body string) error {
	if cfg.SMTPUser == "" || cfg.SMTPPass == "" {
		return fmt.Errorf("SMTP credentials not configured")
	}
	if len(recipients) == 0 {
		return nil
	}

	htmlBody := buildEmailHTML(heading, body)
	from := cfg.SMTPFrom
	if from == "" {
		from = cfg.SMTPUser
	}

	addr := cfg.SMTPHost + ":" + cfg.SMTPPort

	if cfg.SMTPPort == "465" {
		return sendWithTLS(addr, cfg.SMTPHost, cfg.SMTPUser, cfg.SMTPPass, from, recipients, subject, htmlBody)
	}

	// STARTTLS (default, port 587)
	auth := smtp.PlainAuth("", cfg.SMTPUser, cfg.SMTPPass, cfg.SMTPHost)
	msg := buildRawMessage(from, subject, htmlBody)
	return smtp.SendMail(addr, auth, cfg.SMTPUser, recipients, []byte(msg))
}

func sendWithTLS(addr, host, user, pass, from string, to []string, subject, htmlBody string) error {
	tlsCfg := &tls.Config{ServerName: host}
	conn, err := tls.Dial("tcp", addr, tlsCfg)
	if err != nil {
		return err
	}

	client, err := smtp.NewClient(conn, host)
	if err != nil {
		return err
	}
	defer client.Quit() //nolint:errcheck

	auth := smtp.PlainAuth("", user, pass, host)
	if err = client.Auth(auth); err != nil {
		return err
	}
	if err = client.Mail(from); err != nil {
		return err
	}
	for _, t := range to {
		if err = client.Rcpt(t); err != nil {
			return err
		}
	}

	w, err := client.Data()
	if err != nil {
		return err
	}
	msg := buildRawMessage(from, subject, htmlBody)
	if _, err = fmt.Fprint(w, msg); err != nil {
		return err
	}
	return w.Close()
}

func buildRawMessage(from, subject, htmlBody string) string {
	return "From: " + from + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/html; charset=UTF-8\r\n\r\n" +
		htmlBody
}

func buildEmailHTML(heading, body string) string {
	escaped := strings.ReplaceAll(body, "\n", "<br>")
	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a2549;">
  <div style="background:linear-gradient(135deg,#2980e1,#1a2549);padding:30px;border-radius:12px;text-align:center;margin-bottom:24px;">
    <h1 style="color:white;margin:0;font-size:28px;">%s</h1>
  </div>
  <div style="background:#f8faff;padding:24px;border-radius:8px;line-height:1.7;">%s</div>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
  <p style="font-size:12px;color:#999;text-align:center;">
    &copy; 2026 Family STEAM &middot; To unsubscribe reply to familysteamcamp@gmail.com
  </p>
</body>
</html>`, heading, escaped)
}

// SplitHostPort is a helper that wraps net.SplitHostPort for tests.
var SplitHostPort = net.SplitHostPort
