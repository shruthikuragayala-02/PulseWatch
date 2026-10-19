package com.pulsewatch.controller;

import com.pulsewatch.config.UserContextService;
import com.pulsewatch.repository.HealthCheckRepository;
import com.pulsewatch.repository.MonitorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HealthCheckControllerTest {

    @Mock
    private HealthCheckRepository healthCheckRepository;

    @Mock
    private MonitorRepository monitorRepository;

    @Mock
    private UserContextService userContextService;

    private HealthCheckController createController() {
        return new HealthCheckController(healthCheckRepository, monitorRepository, userContextService);
    }

    @Test
    @DisplayName("User A cannot read health checks for User B monitor")
    void userACannotReadOtherUsersHealthChecks() {
        HealthCheckController controller = createController();

        when(userContextService.getCurrentUserId()).thenReturn(100L);
        when(monitorRepository.findByIdAndUserId(2L, 100L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = controller.getChecksForMonitor(2L, 0, 20);

        assertEquals(404, response.getStatusCode().value());
        verify(monitorRepository).findByIdAndUserId(2L, 100L);
        verify(healthCheckRepository, never()).findRecentChecks(anyLong());
    }
}
