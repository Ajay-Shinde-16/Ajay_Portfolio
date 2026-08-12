package com.ajayshinde.portfolio.service;

import com.ajayshinde.portfolio.model.Project;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Collections;
import java.util.List;

/**
 * Loads featured projects from resources/projects.json at startup — the single
 * source of truth shared (as an identical file) with the frontend.
 */
@Service
public class ProjectService {

    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    private List<Project> projects = Collections.emptyList();

    @PostConstruct
    void load() {
        try (InputStream in = new ClassPathResource("projects.json").getInputStream()) {
            projects = List.of(mapper.readValue(in, Project[].class));
        } catch (Exception e) {
            throw new IllegalStateException("Could not load projects.json", e);
        }
    }

    public List<Project> getProjects() {
        return projects;
    }
}
