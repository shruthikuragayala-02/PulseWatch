package com.pulsewatch.controller;

import com.pulsewatch.checker.HealthCheckEngine;
import com.pulsewatch.config.UserContextService;
import com.pulsewatch.dto.HealthCheckDTOs;
import com.pulsewatch.dto.MonitorDTOs;
import com.pulsewatch.entity.HealthCheck;
import com.pulsewatch.entity.Incident;
import com.pulsewatch.entity.Monitor;
import com.pulsewatch.entity.NotificationEvent;
import com.pulsewatch.repository.HealthCheckRepository;
import com.pulsewatch.repository.IncidentRepository;
import com.pulsewatch.repository.MonitorRepository;
import com.pulsewatch.repository.NotificationEventRepository;
import com.pulsewatch.service.MonitorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/v1/monitors")
@Tag(name = "Monitors", description = "Monitor management endpoints")
public class MonitorController {

    private static final long MIN_CHECK_INTERVAL_MS = 10000; // 10 seconds rate limit
    private static final int MAX_CONCURRENT_CHECKS = 10;

    private final MonitorService monitorService;
    private final UserContextService userContextService;
    private final HealthCheckEngine healthCheckEngine;
    private final HealthCheckRepository healthCheckRepository;
    private final IncidentRepository incidentRepository;
    private final NotificationEventRepository notificationEventRepository;
    private final MonitorRepository monitorRepository;

    private final ConcurrentHashMap<Long, Long> lastCheckTime = new ConcurrentHashMap<>();
    private final AtomicInteger activeChecks = new AtomicInteger(0);

    public MonitorController(MonitorService monitorService, UserContextService userContextService,
                             HealthCheckEngine healthCheckEngine, HealthCheckRepository healthCheckRepository,
                             IncidentRepository incidentRepository, NotificationEventRepository notificationEventRepository,
                             MonitorRepository monitorRepository) {
        this.monitorService = monitorService;
        this.userContextService = userContextService;
        this.healthCheckEngine = healthCheckEngine;
        this.healthCheckRepository = healthCheckRepository;
        this.incidentRepository = incidentRepository;
        this.notificationEventRepository = notificationEventRepository;
        this.monitorRepository = monitorRepository;
    }

    @PostMapping
    public ResponseEntity<MonitorDTOs.MonitorResponse> createMonitor(
            @RequestBody MonitorDTOs.CreateMonitorRequest request) {
        Long userId = userContextService.getCurrentUserId();
        return ResponseEntity.ok(monitorService.createMonitor(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<MonitorDTOs.MonitorResponse>> getMonitors() {
        Long userId = userContextService.getCurrentUserId();
        return ResponseEntity.ok(monitorService.getMonitorsByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MonitorDTOs.MonitorResponse> getMonitor(@PathVariable Long id) {
        Long userId = userContextService.getCurrentUserId();
        return ResponseEntity.ok(monitorService.getMonitorById(id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MonitorDTOs.MonitorResponse> updateMonitor(
            @PathVariable Long id,
            @RequestBody MonitorDTOs.UpdateMonitorRequest request) {
        Long userId = userContextService.getCurrentUserId();
        return ResponseEntity.ok(monitorService.updateMonitor(id, userId, request));
    }

    @PostMapping("/{id}/pause")
    public ResponseEntity<Void> pauseMonitor(@PathVariable Long id) {
        Long userId = userContextService.getCurrentUserId();
        monitorService.pauseMonitor(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<Void> resumeMonitor(@PathVariable Long id) {
        Long userId = userContextService.getCurrentUserId();
        monitorService.resumeMonitor(id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMonitor(@PathVariable Long id) {
        Long userId = userContextService.getCurrentUserId();
        monitorService.deleteMonitor(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/check")
    public ResponseEntity<HealthCheckDTOs.HealthCheckResponse> checkNow(@PathVariable Long id) {
        Long userId = userContextService.getCurrentUserId();

        Monitor monitor = monitorRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND,
                "Monitor not found or access denied"));

        // Rate limiting
        Long lastCheck = lastCheckTime.get(id);
        if (lastCheck != null && (System.currentTimeMillis() - lastCheck) < MIN_CHECK_INTERVAL_MS) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.TOO_MANY_REQUESTS,
                "Please wait before checking this monitor again");
        }

        // Concurrency safeguard
        if (activeChecks.get() >= MAX_CONCURRENT_CHECKS) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.TOO_MANY_REQUESTS,
                "Too many concurrent checks. Please try again later.");
        }

        activeChecks.incrementAndGet();
        try {
            lastCheckTime.put(id, System.currentTimeMillis());

            HealthCheck check = healthCheckEngine.performCheck(
                monitor.getId(), monitor.getUrl(), monitor.getTimeoutMs()
            );
            healthCheckRepository.save(check);

            monitor.setLastCheckedAt(LocalDateTime.now());
            monitor.setLastStatusCode(check.getStatusCode());
            monitor.setLastResponseTimeMs(check.getResponseTimeMs());
            monitor.setLastFailureReason(check.getFailureReason());
            monitor.setStatus(check.getResult());
            monitorRepository.save(monitor);

            // Incident detection for on-demand check
            if (check.getResult().equals("DOWN")) {
                incidentRepository.findOpenIncidentByMonitorId(monitor.getId()).ifPresentOrElse(
                    incident -> {
                        // Already have an open incident, don't create duplicate
                    },
                    () -> {
                        Incident incident = new Incident();
                        incident.setMonitorId(monitor.getId());
                        incident.setTitle("Monitor Down: " + monitor.getName());
                        incident.setDescription("On-demand check failed: " + check.getFailureReason());
                        incident.setStatus("OPEN");
                        incident.setStartedAt(LocalDateTime.now());
                        incident.setFailureReason(check.getFailureReason());
                        incidentRepository.save(incident);

                        NotificationEvent event = new NotificationEvent();
                        event.setMonitorId(monitor.getId());
                        event.setIncidentId(incident.getId());
                        event.setEventType("INCIDENT_CREATED");
                        event.setTitle("Monitor Down");
                        event.setMessage("Monitor '" + monitor.getName() + "' is down: " + check.getFailureReason());
                        event.setDeliveryStatus("SENT");
                        notificationEventRepository.save(event);
                    }
                );
            } else if (check.getResult().equals("UP")) {
                incidentRepository.findOpenIncidentByMonitorId(monitor.getId()).ifPresent(incident -> {
                    incident.setStatus("RESOLVED");
                    incident.setResolvedAt(LocalDateTime.now());
                    long duration = java.time.Duration.between(incident.getStartedAt(), LocalDateTime.now()).toSeconds();
                    incident.setDurationSeconds(duration);
                    incidentRepository.save(incident);

                    NotificationEvent event = new NotificationEvent();
                    event.setMonitorId(monitor.getId());
                    event.setIncidentId(incident.getId());
                    event.setEventType("INCIDENT_RESOLVED");
                    event.setTitle("Monitor Recovered");
                    event.setMessage("Monitor '" + monitor.getName() + "' is now UP");
                    event.setDeliveryStatus("SENT");
                    notificationEventRepository.save(event);
                });
            }

            return ResponseEntity.ok(toResponse(check));
        } finally {
            activeChecks.decrementAndGet();
        }
    }

    private HealthCheckDTOs.HealthCheckResponse toResponse(HealthCheck check) {
        HealthCheckDTOs.HealthCheckResponse response = new HealthCheckDTOs.HealthCheckResponse();
        response.setId(check.getId());
        response.setMonitorId(check.getMonitorId());
        response.setCheckedAt(check.getCheckedAt());
        response.setStatusCode(check.getStatusCode());
        response.setResponseTimeMs(check.getResponseTimeMs());
        response.setResult(check.getResult());
        response.setFailureReason(check.getFailureReason());
        response.setErrorDetails(check.getErrorDetails());
        response.setCreatedAt(check.getCreatedAt());
        return response;
    }
}