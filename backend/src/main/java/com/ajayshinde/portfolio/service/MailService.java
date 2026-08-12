package com.ajayshinde.portfolio.service;

import com.ajayshinde.portfolio.model.ContactMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * Emails you when someone submits the contact form.
 *
 * Two transports:
 *  1. Brevo HTTP API (over HTTPS) — used when BREVO_API_KEY is set. This is the
 *     one that works on hosts that block outbound SMTP ports (e.g. Render free).
 *  2. SMTP (JavaMailSender) — fallback for local dev / hosts that allow SMTP.
 *
 * If neither is configured, it just logs the message so the app still runs.
 */
@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);
    private static final String BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10)).build();

    @Value("${app.contact.recipient:Ajay.shinde1606@gmail.com}")
    private String recipient;

    // Must be a VERIFIED sender in Brevo.
    @Value("${app.mail.from:${spring.mail.username:}}")
    private String from;

    @Value("${app.mail.from-name:Portfolio Contact}")
    private String fromName;

    // Brevo HTTP API key (Brevo dashboard -> SMTP & API -> API keys).
    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Value("${spring.mail.username:}")
    private String smtpUser;

    public MailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    public void notifyNewMessage(ContactMessage m) {
        if (from == null || from.isBlank()) {
            log.info("[contact] New message from {} <{}> (no sender configured): {}",
                    m.getName(), m.getEmail(), m.getMessage());
            return;
        }
        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            sendViaApi(m);
        } else if (smtpUser != null && !smtpUser.isBlank()) {
            sendViaSmtp(m);
        } else {
            log.info("[contact] New message from {} <{}> (email disabled): {}",
                    m.getName(), m.getEmail(), m.getMessage());
        }
    }

    /** Preferred: Brevo transactional email API over HTTPS. */
    private void sendViaApi(ContactMessage m) {
        try {
            Map<String, Object> payload = Map.of(
                    "sender", Map.of("name", fromName, "email", from),
                    "to", List.of(Map.of("email", recipient)),
                    "replyTo", Map.of("email", m.getEmail(), "name", m.getName()),
                    "subject", "Portfolio contact — " + m.getName(),
                    "textContent", "From: " + m.getName() + " <" + m.getEmail() + ">\n\n" + m.getMessage()
            );
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(BREVO_ENDPOINT))
                    .header("api-key", brevoApiKey)
                    .header("accept", "application/json")
                    .header("content-type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(payload)))
                    .build();
            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() / 100 == 2) {
                log.info("[contact] Email sent via Brevo API to {}", recipient);
            } else {
                log.warn("[contact] Brevo API returned {}: {}", res.statusCode(), res.body());
            }
        } catch (Exception e) {
            log.warn("[contact] Brevo API send failed: {}", e.getMessage());
        }
    }

    /** Fallback: classic SMTP (works locally / where SMTP ports are open). */
    private void sendViaSmtp(ContactMessage m) {
        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        if (sender == null) {
            log.info("[contact] SMTP not available — message from {} <{}>: {}",
                    m.getName(), m.getEmail(), m.getMessage());
            return;
        }
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(from);
            mail.setTo(recipient);
            mail.setReplyTo(m.getEmail());
            mail.setSubject("Portfolio contact — " + m.getName());
            mail.setText("From: " + m.getName() + " <" + m.getEmail() + ">\n\n" + m.getMessage());
            sender.send(mail);
            log.info("[contact] Email sent via SMTP to {}", recipient);
        } catch (Exception e) {
            log.warn("[contact] SMTP send failed: {}", e.getMessage());
        }
    }
}