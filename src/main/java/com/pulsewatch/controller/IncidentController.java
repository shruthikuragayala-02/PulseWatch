package com.pulsewatch.controller;

import com.pulsewatch.config.UserContextService;
import com.pulsewatch.dto.IncidentDTOs;
import com.pulsewatch.entity.Incident;
import com.pulsewatch.repository.IncidentRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/incidents")
@Tag(name = "Incidents", description = "Incident management endpoints")
public class IncidentController {

    private final IncidentRepository incidentRepository;
    private final UserContextService userContextService;

    public IncidentController(IncidentRepository incidentRepository,
                               UserContextService userContextService) {
        this.incidentRepository = incidentRepository;
        this.userContextService = userContextService;
    }

    @GetMapping
    public ResponseEntity<List<IncidentDTOs.IncidentResponse>> getIncidents() {
        Long userId = userContextService.getCurrentUserId();
        boolean isAdmin = userContextService.isCurrentUserAdmin();

        List<Incident> incidents;
        if (isAdmin) {
            incidents = incidentRepository.findByStatus("OPEN");
        } else {
            incidents = incidentRepository.findByMonitorUserId(userId);
        }

        return ResponseEntity.ok(incidents.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentDTOs.IncidentResponse> getIncident(@PathVariable Long id) {
        Long userId = userContextService.getCurrentUserId();
        boolean isAdmin = userContextService.isCurrentUserAdmin();

        Incident incident;
        if (isAdmin) {
            incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Incident not found"));
        } else {
            incident = incidentRepository.findByIdAndMonitorUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Incident not found or access denied"));
        }

        return ResponseEntity.ok(toResponse(incident));
    }

    @PostMapping("/{id}/acknowledge")
    public ResponseEntity<Void> acknowledgeIncident(@PathVariable Long id,
                                                     @RequestBody IncidentDTOs.AcknowledgeRequest request) {
        Long userId = userContextService.getCurrentUserId();
        boolean isAdmin = userContextService.isCurrentUserAdmin();

        Incident incident;
        if (isAdmin) {
            incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Incident not found"));
        } else {
            incident = incidentRepository.findByIdAndMonitorUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Incident not found or access denied"));
        }

        incident.setAcknowledgedBy(request.getAcknowledgedBy());
        incident.setAcknowledgedAt(java.time.LocalDateTime.now());
        incidentRepository.save(incident);

        return ResponseEntity.ok().build();
    }

    private IncidentDTOs.IncidentResponse toResponse(Incident incident) {
        IncidentDTOs.IncidentResponse response = new IncidentDTOs.IncidentResponse();
        response.setId(incident.getId());
        response.setMonitorId(incident.getMonitorId());
        response.setTitle(incident.getTitle());
        response.setDescription(incident.getDescription());
        response.setStatus(incident.getStatus());
        response.setStartedAt(incident.getStartedAt());
        response.setResolvedAt(incident.getResolvedAt());
        response.setDurationSeconds(incident.getDurationSeconds());
        response.setFailureReason(incident.getFailureReason());
        response.setAcknowledgedBy(incident.getAcknowledgedBy());
        response.setAcknowledgedAt(incident.getAcknowledgedAt());
        response.setCreatedAt(incident.getCreatedAt());
        response.setUpdatedAt(incident.getUpdatedAt());
        return response;
    }
}