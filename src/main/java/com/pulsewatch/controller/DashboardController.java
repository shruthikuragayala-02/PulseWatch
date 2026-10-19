package com.pulsewatch.controller;

import com.pulsewatch.config.UserContextService;
import com.pulsewatch.dto.DashboardDTOs;
import com.pulsewatch.entity.HealthCheck;
import com.pulsewatch.entity.Monitor;
import com.pulsewatch.repository.HealthCheckRepository;
import com.pulsewatch.repository.IncidentRepository;
import com.pulsewatch.repository.MonitorRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/dashboard")
@Tag(name = "Dashboard", description = "Dashboard metrics and summaries")
public class DashboardController {

    private static final int RECENT_FAILURES_LIMIT = 20;

    private final MonitorRepository monitorRepository;
    private final IncidentRepository incidentRepository;
    private final HealthCheckRepository healthCheckRepository;
    private final UserContextService userContextService;

    public DashboardController(MonitorRepository monitorRepository,
                                IncidentRepository incidentRepository,
                                HealthCheckRepository healthCheckRepository,
                                UserContextService userContextService) {
        this.monitorRepository = monitorRepository;
        this.incidentRepository = incidentRepository;
        this.healthCheckRepository = healthCheckRepository;
        this.userContextService = userContextService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardDTOs.DashboardSummary> getSummary() {
        Long userId = userContextService.getCurrentUserId();
        boolean isAdmin = userContextService.isCurrentUserAdmin();

        List<Monitor> monitors;
        if (isAdmin) {
            monitors = monitorRepository.findAll();
        } else {
            monitors = monitorRepository.findByUserId(userId);
        }

        DashboardDTOs.DashboardSummary summary = new DashboardDTOs.DashboardSummary();
        summary.setTotalMonitors(monitors.size());
        summary.setMonitorsUp((int) monitors.stream().filter(m -> "UP".equals(m.getStatus())).count());
        summary.setMonitorsDown((int) monitors.stream().filter(m -> "DOWN".equals(m.getStatus())).count());
        summary.setMonitorsUnknown((int) monitors.stream().filter(m -> "UNKNOWN".equals(m.getStatus())).count());

        if (isAdmin) {
            summary.setOpenIncidents((int) incidentRepository.findByStatus("OPEN").size());
            summary.setResolvedIncidents((int) incidentRepository.findByStatus("RESOLVED").size());
        } else {
            summary.setOpenIncidents((int) incidentRepository.countOpenByUserId(userId));
            summary.setResolvedIncidents((int) incidentRepository.countResolvedByUserId(userId));
        }

        long upCount = monitors.stream().filter(m -> "UP".equals(m.getStatus())).count();
        summary.setUptimePercentage(monitors.isEmpty() ? 0.0 :
            (double) upCount / monitors.size() * 100);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/recent-failures")
    public ResponseEntity<List<DashboardDTOs.RecentFailedCheck>> getRecentFailures() {
        Long userId = userContextService.getCurrentUserId();
        boolean isAdmin = userContextService.isCurrentUserAdmin();

        List<HealthCheck> failures;
        if (isAdmin) {
            failures = healthCheckRepository.findAllRecentFailures(PageRequest.of(0, RECENT_FAILURES_LIMIT));
        } else {
            failures = healthCheckRepository.findRecentFailuresByUserId(userId, PageRequest.of(0, RECENT_FAILURES_LIMIT));
        }

        // Enrich failures with monitor name and URL for the dashboard table
        Map<Long, com.pulsewatch.entity.Monitor> monitorsById = new HashMap<>();
        if (isAdmin) {
            monitorRepository.findAll().forEach(m -> monitorsById.put(m.getId(), m));
        } else {
            monitorRepository.findByUserId(userId).forEach(m -> monitorsById.put(m.getId(), m));
        }

        List<DashboardDTOs.RecentFailedCheck> result = failures.stream()
            .map(check -> toRecentFailedCheck(check, monitorsById))
            .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    private DashboardDTOs.RecentFailedCheck toRecentFailedCheck(HealthCheck check,
                                                                Map<Long, com.pulsewatch.entity.Monitor> monitorsById) {
        DashboardDTOs.RecentFailedCheck dto = new DashboardDTOs.RecentFailedCheck();
        dto.setMonitorId(check.getMonitorId());
        dto.setCheckedAt(check.getCheckedAt());
        dto.setFailureReason(check.getFailureReason());
        com.pulsewatch.entity.Monitor monitor = monitorsById.get(check.getMonitorId());
        if (monitor != null) {
            dto.setMonitorName(monitor.getName());
            dto.setMonitorUrl(monitor.getUrl());
        }
        return dto;
    }
}