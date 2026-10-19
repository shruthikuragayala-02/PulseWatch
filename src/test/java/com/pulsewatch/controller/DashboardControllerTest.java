package com.pulsewatch.controller;

import com.pulsewatch.config.UserContextService;
import com.pulsewatch.dto.DashboardDTOs;
import com.pulsewatch.entity.Incident;
import com.pulsewatch.entity.Monitor;
import com.pulsewatch.repository.HealthCheckRepository;
import com.pulsewatch.repository.IncidentRepository;
import com.pulsewatch.repository.MonitorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardControllerTest {

    @Mock
    private MonitorRepository monitorRepository;

    @Mock
    private IncidentRepository incidentRepository;

    @Mock
    private HealthCheckRepository healthCheckRepository;

    @Mock
    private UserContextService userContextService;

    private DashboardController createController() {
        return new DashboardController(monitorRepository, incidentRepository, healthCheckRepository, userContextService);
    }

    @Test
    @DisplayName("Dashboard summary returns correct counts for user's monitors")
    void dashboardSummaryReturnsUserCounts() {
        DashboardController controller = createController();

        Monitor m1 = new Monitor();
        m1.setId(1L);
        m1.setUserId(100L);
        m1.setName("API 1");
        m1.setStatus("UP");

        Monitor m2 = new Monitor();
        m2.setId(2L);
        m2.setUserId(100L);
        m2.setName("API 2");
        m2.setStatus("DOWN");

        Monitor m3 = new Monitor();
        m3.setId(3L);
        m3.setUserId(100L);
        m3.setName("API 3");
        m3.setStatus("UNKNOWN");

        List<Monitor> monitors = Arrays.asList(m1, m2, m3);

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(userContextService.isCurrentUserAdmin()).thenReturn(false);
        when(monitorRepository.findByUserId(100L)).thenReturn(monitors);
        when(incidentRepository.countOpenByUserId(100L)).thenReturn(1L);
        when(incidentRepository.countResolvedByUserId(100L)).thenReturn(2L);

        ResponseEntity<DashboardDTOs.DashboardSummary> response = controller.getSummary();

        assertEquals(200, response.getStatusCode().value());
        DashboardDTOs.DashboardSummary summary = response.getBody();
        assertNotNull(summary);
        assertEquals(3, summary.getTotalMonitors());
        assertEquals(1, summary.getMonitorsUp());
        assertEquals(1, summary.getMonitorsDown());
        assertEquals(1, summary.getMonitorsUnknown());
        assertEquals(1, summary.getOpenIncidents());
        assertEquals(2, summary.getResolvedIncidents());
        assertEquals(33.33, summary.getUptimePercentage(), 0.01);
    }

    @Test
    @DisplayName("Admin dashboard summary counts all monitors")
    void adminDashboardCountsAll() {
        DashboardController controller = createController();

        Monitor m1 = new Monitor();
        m1.setId(1L);
        m1.setUserId(100L);
        m1.setStatus("UP");

        Monitor m2 = new Monitor();
        m2.setId(2L);
        m2.setUserId(200L);
        m2.setStatus("DOWN");

        List<Monitor> allMonitors = Arrays.asList(m1, m2);

        List<Incident> openIncidents = Arrays.asList(new Incident());
        List<Incident> resolvedIncidents = Arrays.asList(new Incident(), new Incident());

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(userContextService.isCurrentUserAdmin()).thenReturn(true);
        when(monitorRepository.findAll()).thenReturn(allMonitors);
        when(incidentRepository.findByStatus("OPEN")).thenReturn(openIncidents);
        when(incidentRepository.findByStatus("RESOLVED")).thenReturn(resolvedIncidents);

        ResponseEntity<DashboardDTOs.DashboardSummary> response = controller.getSummary();

        assertEquals(200, response.getStatusCode().value());
        DashboardDTOs.DashboardSummary summary = response.getBody();
        assertNotNull(summary);
        assertEquals(2, summary.getTotalMonitors());
        assertEquals(1, summary.getMonitorsUp());
        assertEquals(1, summary.getMonitorsDown());
        assertEquals(1, summary.getOpenIncidents());
        assertEquals(2, summary.getResolvedIncidents());
    }

    @Test
    @DisplayName("Dashboard with no monitors returns zero uptime")
    void dashboardNoMonitorsReturnsZeroUptime() {
        DashboardController controller = createController();

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(userContextService.isCurrentUserAdmin()).thenReturn(false);
        when(monitorRepository.findByUserId(100L)).thenReturn(Arrays.asList());
        when(incidentRepository.countOpenByUserId(100L)).thenReturn(0L);
        when(incidentRepository.countResolvedByUserId(100L)).thenReturn(0L);

        ResponseEntity<DashboardDTOs.DashboardSummary> response = controller.getSummary();

        assertEquals(200, response.getStatusCode().value());
        DashboardDTOs.DashboardSummary summary = response.getBody();
        assertNotNull(summary);
        assertEquals(0, summary.getTotalMonitors());
        assertEquals(0.0, summary.getUptimePercentage(), 0.01);
    }

    @Test
    @DisplayName("Recent failures endpoint returns user's failed checks")
    void recentFailuresReturnsUserChecks() {
        DashboardController controller = createController();

        com.pulsewatch.entity.HealthCheck check1 = new com.pulsewatch.entity.HealthCheck();
        check1.setId(1L);
        check1.setMonitorId(10L);
        check1.setResult("DOWN");
        check1.setFailureReason("Connection timeout");
        check1.setCheckedAt(LocalDateTime.now());

        com.pulsewatch.entity.HealthCheck check2 = new com.pulsewatch.entity.HealthCheck();
        check2.setId(2L);
        check2.setMonitorId(11L);
        check2.setResult("DOWN");
        check2.setFailureReason("HTTP 500");
        check2.setCheckedAt(LocalDateTime.now().minusMinutes(5));

        List<com.pulsewatch.entity.HealthCheck> failures = Arrays.asList(check1, check2);

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(userContextService.isCurrentUserAdmin()).thenReturn(false);
        when(monitorRepository.findByUserId(100L)).thenReturn(java.util.Collections.emptyList());
        when(healthCheckRepository.findRecentFailuresByUserId(anyLong(), any()))
            .thenReturn(failures);

        ResponseEntity<List<DashboardDTOs.RecentFailedCheck>> response = controller.getRecentFailures();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(2, response.getBody().size());
        assertEquals("Connection timeout", response.getBody().get(0).getFailureReason());
        assertEquals("HTTP 500", response.getBody().get(1).getFailureReason());
    }
}
