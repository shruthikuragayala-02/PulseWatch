package com.pulsewatch.repository;

import com.pulsewatch.entity.Monitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonitorRepository extends JpaRepository<Monitor, Long> {
    List<Monitor> findByUserId(Long userId);
    Optional<Monitor> findByIdAndUserId(Long id, Long userId);
    long countByUserId(Long userId);
    List<Monitor> findByEnabledTrue();
    List<Monitor> findByEnabledTrueAndLastCheckedAtIsNull();
    
    @Query("SELECT m FROM Monitor m WHERE m.enabled = true AND (m.lastCheckedAt IS NULL OR m.lastCheckedAt <= :lastCheckTime)")
    List<Monitor> findDueMonitors(@Param("lastCheckTime") java.time.LocalDateTime lastCheckTime);
}