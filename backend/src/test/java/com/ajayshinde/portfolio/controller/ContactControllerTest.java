package com.ajayshinde.portfolio.controller;

import com.ajayshinde.portfolio.model.ContactMessage;
import com.ajayshinde.portfolio.repository.ContactMessageRepository;
import com.ajayshinde.portfolio.service.MailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContactController.class)
@TestPropertySource(properties = {
        "app.cors.allowed-origins=http://localhost:5173",
        "app.admin.token=test-token"
})
class ContactControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private ContactMessageRepository repository;

    @MockBean
    private MailService mailService;

    @Test
    void validSubmissionIsAccepted() throws Exception {
        when(repository.save(any(ContactMessage.class))).thenAnswer(inv -> inv.getArgument(0));

        mvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Recruiter\",\"email\":\"r@company.com\",\"message\":\"Hi Ajay!\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("ok"));

        verify(repository, times(1)).save(any(ContactMessage.class));
        verify(mailService, times(1)).notifyNewMessage(any(ContactMessage.class));
    }

    @Test
    void missingNameIsRejected() throws Exception {
        mvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"r@company.com\",\"message\":\"Hi\"}"))
                .andExpect(status().isBadRequest());

        verify(repository, never()).save(any());
    }

    @Test
    void honeypotSubmissionIsSilentlyDropped() throws Exception {
        mvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Bot\",\"email\":\"b@x.com\",\"message\":\"spam\",\"website\":\"http://spam\"}"))
                .andExpect(status().isCreated());

        // Bots never reach the database or trigger an email.
        verify(repository, never()).save(any());
        verify(mailService, never()).notifyNewMessage(any());
    }
}
