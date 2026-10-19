package com.pulsewatch.controller;

import com.pulsewatch.config.UserContextService;
import com.pulsewatch.dto.IncidentDTOs;
import com.pulsewatch.entity.Incident;
import com.pulsewatch.repository.IncidentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentControllerTest {

    @Mock
    private IncidentRepository incidentRepository;

    @Mock
    private UserContextService userContextService;

    private IncidentController createController() {
        return new IncidentController(incidentRepository, userContextService);
    }

    @Test
    @DisplayName("User can only see their own incidents (not others')")
    void userSeesOnlyOwnIncidents() {
        IncidentController controller = createController();

        Incident incident1 = new Incident();
        incident1.setId(1L);
        incident1.setMonitorId(10L);
        incident1.setTitle("My Incident");
        incident1.setStatus("OPEN");
        incident1.setStartedAt(LocalDateTime.now());

        Incident incident2 = new Incident();
        incident2.setId(2L);
        incident2.setMonitorId(20L);
        incident2.setTitle("Other User's Incident");
        incident2.setStatus("OPEN");
        incident2.setStartedAt(LocalDateTime.now());

        List<Incident> userIncidents = Arrays.asList(incident1);

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(userContextService.isCurrentUserAdmin()).thenReturn(false);
        when(incidentRepository.findByMonitorUserId(100L)).thenReturn(userIncidents);

        ResponseEntity<List<IncidentDTOs.IncidentResponse>> response = controller.getIncidents();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        assertEquals("My Incident", response.getBody().get(0).getTitle());
        verify(incidentRepository).findByMonitorUserId(100L);
        verify(incidentRepository, never()).findByStatus(anyString());
    }

    @Test
    @DisplayName("Admin can see all open incidents")
    void adminSeesAllIncidents() {
        IncidentController controller = createController();

        Incident incident1 = new Incident();
        incident1.setId(1L);
        incident1.setMonitorId(10L);
        incident1.setTitle("Incident 1");
        incident1.setStatus("OPEN");
        incident1.setStartedAt(LocalDateTime.now());

        Incident incident2 = new Incident();
        incident2.setId(2L);
        incident2.setMonitorId(20L);
        incident2.setTitle("Incident 2");
        incident2.setStatus("OPEN");
        incident2.setStartedAt(LocalDateTime.now());

        List<Incident> allIncidents = Arrays.asList(incident1, incident2);

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(userContextService.isCurrentUserAdmin()).thenReturn(true);
        when(incidentRepository.findByStatus("OPEN")).thenReturn(allIncidents);

        ResponseEntity<List<IncidentDTOs.IncidentResponse>> response = controller.getIncidents();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(2, response.getBody().size());
        verify(incidentRepository).findByStatus("OPEN");
    }

    @Test
    @DisplayName("User cannot access another user's incident by ID")
    void userCannotAccessOtherUsersIncident() {
        IncidentController controller = createController();

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(userContextService.isCurrentUserAdmin()).thenReturn(false);
        when(incidentRepository.findByIdAndMonitorUserId(999L, 100L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> controller.getIncident(999L));
    }

    @Test
    @DisplayName("Admin can access any incident by ID")
    void adminCanAccessAnyIncident() {
        IncidentController controller = createController();

        Incident incident = new Incident();
        incident.setId(999L);
        incident.setMonitorId(20L);
        incident.setTitle("Other User's Incident");
        incident.setStatus("OPEN");
        incident.setStartedAt(LocalDateTime.now());

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(userContextService.isCurrentUserAdmin()).thenReturn(true);
        when(incidentRepository.findById(999L)).thenReturn(Optional.of(incident));

        ResponseEntity<IncidentDTOs.IncidentResponse> response = controller.getIncident(999L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(999L, response.getBody().getId());
    }

    @Test
    @DisplayName("User cannot acknowledge another user's incident")
    void userCannotAcknowledgeOtherUsersIncident() {
        IncidentController controller = createController();

        IncidentDTOs.AcknowledgeRequest request = new IncidentDTOs.AcknowledgeRequest();
        request.setAcknowledgedBy("attacker");

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(userContextService.isCurrentUserAdmin()).thenReturn(false);
        when(incidentRepository.findByIdAndMonitorUserId(999L, 100L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
            () -> controller.acknowledgeIncident(999L, request));
    }

    @Test
    @DisplayName("Incident response contains all required fields")
    void incidentResponseHasRequiredFields() {
        Incident incident = new Incident();
        incident.setId(1L);
        incident.setMonitorId(10L);
        incident.setTitle("Test Incident");
        incident.setDescription("Test description");
        incident.setStatus("OPEN");
        incident.setStartedAt(LocalDateTime.now());
        incident.setFailureReason("Connection timeout");

        IncidentDTOs.IncidentResponse response = new IncidentDTOs.IncidentResponse();
        response.setId(incident.getId());
        response.setMonitorId(incident.getMonitorId());
        response.setTitle(incident.getTitle());
        response.setDescription(incident.getDescription());
        response.setStatus(incident.getStatus());
        response.setStartedAt(incident.getStartedAt());
        response.setFailureReason(incident.getFailureReason());

        assertEquals(1L, response.getId());
        assertEquals(10L, response.getMonitorId());
        assertEquals("Test Incident", response.getTitle());
        assertEquals("Test description", response.getDescription());
        assertEquals("OPEN", response.getStatus());
        assertEquals("Connection timeout", response.getFailureReason());
    }
}
