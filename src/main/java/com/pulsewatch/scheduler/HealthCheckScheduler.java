package com.pulsewatch.scheduler;

import com.pulsewatch.checker.HealthCheckEngine;
import com.pulsewatch.entity.HealthCheck;
import com.pulsewatch.entity.Incident;
import com.pulsewatch.entity.Monitor;
import com.pulsewatch.entity.NotificationEvent;
import com.pulsewatch.repository.HealthCheckRepository;
import com.pulsewatch.repository.IncidentRepository;
import com.pulsewatch.repository.MonitorRepository;
import com.pulsewatch.repository.NotificationEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class HealthCheckScheduler {

    private static final Logger logger = LoggerFactory.getLogger(HealthCheckScheduler.class);

    private final HealthCheckEngine healthCheckEngine;
    private final MonitorRepository monitorRepository;
    private final HealthCheckRepository healthCheckRepository;
    private final IncidentRepository incidentRepository;
    private final NotificationEventRepository notificationEventRepository;

    private final AtomicInteger activeChecks = new AtomicInteger(0);
    private final int maxConcurrentChecks = 10;

    // Track consecutive failures per monitor
    private final ConcurrentHashMap<Long, AtomicInteger> consecutiveFailures = new ConcurrentHashMap<>();
    // Track last notification time per monitor
    private final ConcurrentHashMap<Long, LocalDateTime> lastNotificationTime = new ConcurrentHashMap<>();

    public HealthCheckScheduler(HealthCheckEngine healthCheckEngine,
                                MonitorRepository monitorRepository,
                                HealthCheckRepository healthCheckRepository,
                                IncidentRepository incidentRepository,
                                NotificationEventRepository notificationEventRepository) {
        this.healthCheckEngine = healthCheckEngine;
        this.monitorRepository = monitorRepository;
        this.healthCheckRepository = healthCheckRepository;
        this.incidentRepository = incidentRepository;
        this.notificationEventRepository = notificationEventRepository;
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void runScheduledChecks() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(1);
        List<Monitor> dueMonitors = monitorRepository.findDueMonitors(cutoffTime);

        for (Monitor monitor : dueMonitors) {
            if (activeChecks.get() >= maxConcurrentChecks) {
                break;
            }
            activeChecks.incrementAndGet();
            try {
                performCheckWithIncidentDetection(monitor);
            } finally {
                activeChecks.decrementAndGet();
            }
        }
    }

    private void performCheckWithIncidentDetection(Monitor monitor) {
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

        AtomicInteger failures = consecutiveFailures.computeIfAbsent(
            monitor.getId(), k -> new AtomicInteger(0)
        );

        if (check.getResult().equals("UP")) {
            if (failures.get() > 0) {
                handleRecovery(monitor);
            }
            failures.set(0);
        } else {
            failures.incrementAndGet();
            if (failures.get() >= monitor.getFailureThreshold()) {
                handleFailure(monitor, check);
            }
        }
    }

    private void handleFailure(Monitor monitor, HealthCheck check) {
        // Check for existing open incident
        incidentRepository.findOpenIncidentByMonitorId(monitor.getId()).ifPresent(incident -> {
            // Already have an open incident, don't create duplicate
            return;
        });

        Incident incident = new Incident();
        incident.setMonitorId(monitor.getId());
        incident.setTitle("Monitor Down: " + monitor.getName());
        incident.setDescription("Monitor '" + monitor.getName() + "' failed health check: " + check.getFailureReason());
        incident.setStatus("OPEN");
        incident.setStartedAt(LocalDateTime.now());
        incident.setFailureReason(check.getFailureReason());
        incidentRepository.save(incident);

        // Send notification (in-app only for now)
        sendNotification(monitor, incident, "INCIDENT_CREATED", "Monitor Down", 
            "Monitor '" + monitor.getName() + "' is down: " + check.getFailureReason());

        lastNotificationTime.put(monitor.getId(), LocalDateTime.now());
    }

    private void handleRecovery(Monitor monitor) {
        incidentRepository.findOpenIncidentByMonitorId(monitor.getId()).ifPresent(incident -> {
            incident.setStatus("RESOLVED");
            incident.setResolvedAt(LocalDateTime.now());
            long duration = java.time.Duration.between(incident.getStartedAt(), LocalDateTime.now()).toSeconds();
            incident.setDurationSeconds(duration);
            incidentRepository.save(incident);

            sendNotification(monitor, incident, "INCIDENT_RESOLVED", "Monitor Recovered",
                "Monitor '" + monitor.getName() + "' is now UP");

            lastNotificationTime.put(monitor.getId(), LocalDateTime.now());
        });
    }

    private void sendNotification(Monitor monitor, Incident incident, String type, String title, String message) {
        NotificationEvent event = new NotificationEvent();
        event.setMonitorId(monitor.getId());
        event.setIncidentId(incident != null ? incident.getId() : null);
        event.setEventType(type);
        event.setTitle(title);
        event.setMessage(message);
        event.setDeliveryStatus("SENT");
        notificationEventRepository.save(event);
    }
}