package com.pulsewatch.controller;

import com.pulsewatch.config.UserContextService;
import com.pulsewatch.dto.HealthCheckDTOs;
import com.pulsewatch.entity.HealthCheck;
import com.pulsewatch.repository.HealthCheckRepository;
import com.pulsewatch.repository.MonitorRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/health-checks")
public class HealthCheckController {

    private final HealthCheckRepository healthCheckRepository;
    private final MonitorRepository monitorRepository;
    private final UserContextService userContextService;

    public HealthCheckController(HealthCheckRepository healthCheckRepository,
                                  MonitorRepository monitorRepository,
                                  UserContextService userContextService) {
        this.healthCheckRepository = healthCheckRepository;
        this.monitorRepository = monitorRepository;
        this.userContextService = userContextService;
    }

    @GetMapping("/monitor/{monitorId}")
    public ResponseEntity<HealthCheckDTOs.PaginatedResponse<HealthCheckDTOs.HealthCheckResponse>> getChecksForMonitor(
            @PathVariable Long monitorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long userId = userContextService.getCurrentUserId();
        if (monitorRepository.findByIdAndUserId(monitorId, userId).isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        List<HealthCheck> checks = healthCheckRepository.findRecentChecks(monitorId);

        HealthCheckDTOs.PaginatedResponse<HealthCheckDTOs.HealthCheckResponse> response =
            new HealthCheckDTOs.PaginatedResponse<>();
        List<HealthCheckDTOs.HealthCheckResponse> content = checks.stream()
            .skip((long) page * size)
            .limit(size)
            .map(this::toResponse)
            .collect(Collectors.toList());
        response.setContent(content);
        response.setPage(page);
        response.setSize(size);
        response.setTotalElements(checks.size());
        response.setTotalPages((int) Math.ceil((double) checks.size() / size));
        response.setHasNext((page + 1) * size < checks.size());
        response.setHasPrevious(page > 0);

        return ResponseEntity.ok(response);
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