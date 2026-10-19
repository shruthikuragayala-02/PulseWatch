package com.pulsewatch.repository;

import com.pulsewatch.entity.HealthCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthCheckRepository extends JpaRepository<HealthCheck, Long> {
    List<HealthCheck> findByMonitorIdOrderByCheckedAtDesc(Long monitorId);
    List<HealthCheck> findByMonitorIdAndCheckedAtBetweenOrderByCheckedAtDesc(
        Long monitorId, java.time.LocalDateTime from, java.time.LocalDateTime to);
    
    @Query("SELECT COUNT(h) FROM HealthCheck h WHERE h.monitorId = :monitorId AND h.result = 'UP'")
    long countUpChecks(@Param("monitorId") Long monitorId);
    
    @Query("SELECT COUNT(h) FROM HealthCheck h WHERE h.monitorId = :monitorId")
    long countTotalChecks(@Param("monitorId") Long monitorId);
    
    @Query("SELECT COUNT(h) FROM HealthCheck h WHERE h.monitorId = :monitorId AND h.result = 'UP' AND h.checkedAt >= :since")
    long countUpChecksSince(@Param("monitorId") Long monitorId, @Param("since") java.time.LocalDateTime since);
    
    @Query("SELECT COUNT(h) FROM HealthCheck h WHERE h.monitorId = :monitorId AND h.checkedAt >= :since")
    long countTotalChecksSince(@Param("monitorId") Long monitorId, @Param("since") java.time.LocalDateTime since);
    
    @Query("SELECT COALESCE(AVG(h.responseTimeMs), 0) FROM HealthCheck h WHERE h.monitorId = :monitorId")
    Double findAverageResponseTime(@Param("monitorId") Long monitorId);
    
    @Query("SELECT COALESCE(AVG(h.responseTimeMs), 0) FROM HealthCheck h WHERE h.monitorId = :monitorId AND h.checkedAt >= :since")
    Double findAverageResponseTimeSince(@Param("monitorId") Long monitorId, @Param("since") java.time.LocalDateTime since);
    
    @Query("SELECT MAX(h.responseTimeMs) FROM HealthCheck h WHERE h.monitorId = :monitorId")
    Long findMaxResponseTime(@Param("monitorId") Long monitorId);
    
    @Query("SELECT h FROM HealthCheck h WHERE h.monitorId = :monitorId ORDER BY h.checkedAt DESC")
    List<HealthCheck> findRecentChecks(@Param("monitorId") Long monitorId);

    @Query("SELECT h FROM HealthCheck h JOIN Monitor m ON h.monitorId = m.id WHERE m.userId = :userId AND h.result = 'DOWN' ORDER BY h.checkedAt DESC")
    List<HealthCheck> findRecentFailuresByUserId(@Param("userId") Long userId, org.springframework.data.domain.Pageable pageable);

    @Query("SELECT h FROM HealthCheck h WHERE h.result = 'DOWN' ORDER BY h.checkedAt DESC")
    List<HealthCheck> findAllRecentFailures(org.springframework.data.domain.Pageable pageable);
}