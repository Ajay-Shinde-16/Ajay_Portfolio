package com.ajayshinde.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Incoming contact-form payload. Kept separate from the JPA entity so the API
 * surface and the database model can evolve independently — and so the honeypot
 * field never touches the database.
 */
public class ContactRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 120)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;

    @NotBlank(message = "Message is required")
    @Size(max = 2000, message = "Message is too long")
    private String message;

    /** Honeypot: real users never see or fill this. Bots do. */
    private String website;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}
