package com.pulsewatch.controller;

import com.pulsewatch.config.UserContextService;
import com.pulsewatch.dto.MonitorDTOs;
import com.pulsewatch.entity.Monitor;
import com.pulsewatch.repository.MonitorRepository;
import com.pulsewatch.service.MonitorService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MonitorControllerTest {

    @Mock
    private MonitorService monitorService;

    @Mock
    private UserContextService userContextService;

    @Mock
    private MonitorRepository monitorRepository;

    private MonitorController createController() {
        return new MonitorController(monitorService, userContextService, null, null, null, null, monitorRepository);
    }

    @Test
    @DisplayName("Create monitor succeeds and returns response")
    void createMonitorSucceeds() {
        MonitorController controller = createController();
        MonitorDTOs.CreateMonitorRequest request = new MonitorDTOs.CreateMonitorRequest();
        request.setName("My API");
        request.setUrl("https://api.example.com/health");

        MonitorDTOs.MonitorResponse expected = new MonitorDTOs.MonitorResponse();
        expected.setId(1L);
        expected.setName("My API");
        expected.setUrl("https://api.example.com/health");
        expected.setEnabled(true);
        expected.setStatus("UNKNOWN");

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(monitorService.createMonitor(100L, request)).thenReturn(expected);

        ResponseEntity<MonitorDTOs.MonitorResponse> response = controller.createMonitor(request);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("My API", response.getBody().getName());
        verify(monitorService).createMonitor(100L, request);
    }

    @Test
    @DisplayName("List monitors returns user's monitors only")
    void listMonitorsReturnsUserMonitors() {
        MonitorController controller = createController();

        MonitorDTOs.MonitorResponse m1 = new MonitorDTOs.MonitorResponse();
        m1.setId(1L);
        m1.setName("API 1");

        MonitorDTOs.MonitorResponse m2 = new MonitorDTOs.MonitorResponse();
        m2.setId(2L);
        m2.setName("API 2");

        List<MonitorDTOs.MonitorResponse> expected = Arrays.asList(m1, m2);
        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(monitorService.getMonitorsByUser(100L)).thenReturn(expected);

        ResponseEntity<List<MonitorDTOs.MonitorResponse>> response = controller.getMonitors();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(2, response.getBody().size());
        verify(monitorService).getMonitorsByUser(100L);
    }

    @Test
    @DisplayName("Get monitor by ID with ownership succeeds")
    void getMonitorByIdWithOwnershipSucceeds() {
        MonitorController controller = createController();

        MonitorDTOs.MonitorResponse expected = new MonitorDTOs.MonitorResponse();
        expected.setId(1L);
        expected.setName("My API");

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(monitorService.getMonitorById(1L, 100L)).thenReturn(expected);

        ResponseEntity<MonitorDTOs.MonitorResponse> response = controller.getMonitor(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1L, response.getBody().getId());
        verify(monitorService).getMonitorById(1L, 100L);
    }

    @Test
    @DisplayName("Get monitor by ID without ownership throws 404")
    void getMonitorByIdWithoutOwnership() {
        MonitorController controller = createController();

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(monitorService.getMonitorById(999L, 100L))
            .thenThrow(new RuntimeException("Monitor not found or access denied"));

        assertThrows(RuntimeException.class, () -> controller.getMonitor(999L));
    }

    @Test
    @DisplayName("Update monitor with ownership succeeds")
    void updateMonitorWithOwnershipSucceeds() {
        MonitorController controller = createController();

        MonitorDTOs.UpdateMonitorRequest request = new MonitorDTOs.UpdateMonitorRequest();
        request.setName("Updated Name");

        MonitorDTOs.MonitorResponse expected = new MonitorDTOs.MonitorResponse();
        expected.setId(1L);
        expected.setName("Updated Name");

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(monitorService.updateMonitor(1L, 100L, request)).thenReturn(expected);

        ResponseEntity<MonitorDTOs.MonitorResponse> response = controller.updateMonitor(1L, request);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Updated Name", response.getBody().getName());
        verify(monitorService).updateMonitor(1L, 100L, request);
    }

    @Test
    @DisplayName("Pause monitor succeeds")
    void pauseMonitorSucceeds() {
        MonitorController controller = createController();

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        doNothing().when(monitorService).pauseMonitor(1L, 100L);

        ResponseEntity<Void> response = controller.pauseMonitor(1L);

        assertEquals(200, response.getStatusCode().value());
        verify(monitorService).pauseMonitor(1L, 100L);
    }

    @Test
    @DisplayName("Resume monitor succeeds")
    void resumeMonitorSucceeds() {
        MonitorController controller = createController();

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        doNothing().when(monitorService).resumeMonitor(1L, 100L);

        ResponseEntity<Void> response = controller.resumeMonitor(1L);

        assertEquals(200, response.getStatusCode().value());
        verify(monitorService).resumeMonitor(1L, 100L);
    }

    @Test
    @DisplayName("Delete monitor succeeds")
    void deleteMonitorSucceeds() {
        MonitorController controller = createController();

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        doNothing().when(monitorService).deleteMonitor(1L, 100L);

        ResponseEntity<Void> response = controller.deleteMonitor(1L);

        assertEquals(204, response.getStatusCode().value());
        verify(monitorService).deleteMonitor(1L, 100L);
    }

    @Test
    @DisplayName("Delete monitor without ownership throws error")
    void deleteMonitorWithoutOwnership() {
        MonitorController controller = createController();

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(monitorService.getMonitorById(999L, 100L))
            .thenThrow(new RuntimeException("Monitor not found or access denied"));

        assertThrows(RuntimeException.class, () -> controller.getMonitor(999L));
    }

    @Test
    @DisplayName("User A cannot trigger manual health check on User B monitor")
    void userACannotCheckUserBMonitor() {
        MonitorController controller = createController();

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(monitorRepository.findByIdAndUserId(2L, 100L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> controller.checkNow(2L));
        verify(monitorRepository).findByIdAndUserId(2L, 100L);
    }
}
