package com.ajayshinde.portfolio.service;

import com.ajayshinde.portfolio.model.ContactMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Emails you when someone submits the contact form.
 * If SMTP isn't configured (no JavaMailSender bean), it logs instead of failing,
 * so the app still runs out of the box.
 */
@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${app.contact.recipient:Ajay.shinde1606@gmail.com}")
    private String recipient;

    // The "From" must be an address you've VERIFIED as a sender in Brevo.
    // Defaults to the SMTP username if not set separately.
    @Value("${app.mail.from:${spring.mail.username:}}")
    private String from;

    // SMTP login — used only to detect whether mail is configured.
    @Value("${spring.mail.username:}")
    private String smtpUser;

    public MailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    public void notifyNewMessage(ContactMessage m) {
        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        if (sender == null || smtpUser == null || smtpUser.isBlank() || from == null || from.isBlank()) {
            log.info("[contact] New message from {} <{}> (email disabled — set spring.mail.* to enable): {}",
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
            log.info("[contact] Notification email sent to {}", recipient);
        } catch (Exception e) {
            log.warn("[contact] Failed to send notification email: {}", e.getMessage());
        }
    }
}