package com.ajayshinde.portfolio.controller;

import com.ajayshinde.portfolio.dto.ContactRequest;
import com.ajayshinde.portfolio.model.ContactMessage;
import com.ajayshinde.portfolio.repository.ContactMessageRepository;
import com.ajayshinde.portfolio.service.MailService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final ContactMessageRepository repository;
    private final MailService mailService;

    /** Token required to read stored messages. Set app.admin.token in production. */
    @Value("${app.admin.token:change-me}")
    private String adminToken;

    // Very small in-memory rate limiter: max 5 submissions per IP per 10 minutes.
    private static final int MAX_PER_WINDOW = 5;
    private static final long WINDOW_MS = 10 * 60 * 1000L;
    private final Map<String, long[]> hits = new ConcurrentHashMap<>();

    public ContactController(ContactMessageRepository repository, MailService mailService) {
        this.repository = repository;
        this.mailService = mailService;
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> submit(@Valid @RequestBody ContactRequest req,
                                                      HttpServletRequest http) {
        // 1) Honeypot — if the hidden field is filled, it's a bot. Pretend success, drop it.
        if (req.getWebsite() != null && !req.getWebsite().isBlank()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", "ok"));
        }

        // 2) Rate limit per IP.
        if (isRateLimited(clientIp(http))) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("message", "Too many messages — please try again later."));
        }

        // 3) Persist + notify.
        ContactMessage saved = repository.save(toEntity(req));
        mailService.notifyNewMessage(saved);

        // Map.of() rejects null values, and saved.getId() can be null (e.g. with a
        // mocked repository, or before the DB assigns an id), so build it safely.
        Map<String, Object> body = new HashMap<>();
        body.put("status", "ok");
        if (saved.getId() != null) body.put("id", saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    /** Token-protected listing so contact submissions aren't public. */
    @GetMapping("/contact")
    public ResponseEntity<?> all(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        if (adminToken == null || !adminToken.equals(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
        }
        return ResponseEntity.ok(repository.findAll());
    }

    // ---- helpers -----------------------------------------------------------

    private ContactMessage toEntity(ContactRequest req) {
        ContactMessage m = new ContactMessage();
        m.setName(req.getName().trim());
        m.setEmail(req.getEmail().trim());
        m.setMessage(req.getMessage().trim());
        return m;
    }

    private String clientIp(HttpServletRequest http) {
        String fwd = http.getHeader("X-Forwarded-For");
        return (fwd != null && !fwd.isBlank()) ? fwd.split(",")[0].trim() : http.getRemoteAddr();
    }

    private boolean isRateLimited(String ip) {
        long now = Instant.now().toEpochMilli();
        // Opportunistically drop expired entries so the map can't grow forever.
        if (hits.size() > 5000) {
            hits.entrySet().removeIf(e -> now - e.getValue()[0] > WINDOW_MS);
        }
        long[] rec = hits.compute(ip, (k, v) -> {
            if (v == null || now - v[0] > WINDOW_MS) return new long[]{now, 1};
            v[1]++;
            return v;
        });
        return rec[1] > MAX_PER_WINDOW;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .findFirst()
                .orElse("Invalid input");
        return Map.of("message", msg);
    }
}