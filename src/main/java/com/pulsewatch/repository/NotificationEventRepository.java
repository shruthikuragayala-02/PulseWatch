package com.pulsewatch.repository;

import com.pulsewatch.entity.NotificationEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationEventRepository extends JpaRepository<NotificationEvent, Long> {
    List<NotificationEvent> findByMonitorId(Long monitorId);
    List<NotificationEvent> findByIncidentId(Long incidentId);
    List<NotificationEvent> findByMonitorIdAndEventType(Long monitorId, String eventType);
    long countByMonitorIdAndEventTypeAndSentAtAfter(Long monitorId, String eventType, java.time.LocalDateTime since);
}