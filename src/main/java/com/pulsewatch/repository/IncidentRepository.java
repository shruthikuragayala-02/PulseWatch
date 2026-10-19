package com.pulsewatch.repository;

import com.pulsewatch.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByMonitorId(Long monitorId);
    List<Incident> findByStatus(String status);
    long countByStatus(String status);
    long countByMonitorId(Long monitorId);
    
    @Query("SELECT i FROM Incident i WHERE i.monitorId = :monitorId AND i.status = 'OPEN'")
    Optional<Incident> findOpenIncidentByMonitorId(@Param("monitorId") Long monitorId);
    
    @Query("SELECT i FROM Incident i WHERE i.monitorId = :monitorId AND i.status = 'OPEN' AND i.startedAt >= :since")
    Optional<Incident> findOpenIncidentSince(@Param("monitorId") Long monitorId, @Param("since") java.time.LocalDateTime since);

    // User-scoped incident queries (ownership through monitors)
    @Query("SELECT i FROM Incident i JOIN Monitor m ON i.monitorId = m.id WHERE m.userId = :userId ORDER BY i.startedAt DESC")
    List<Incident> findByMonitorUserId(@Param("userId") Long userId);

    @Query("SELECT i FROM Incident i JOIN Monitor m ON i.monitorId = m.id WHERE i.id = :id AND m.userId = :userId")
    Optional<Incident> findByIdAndMonitorUserId(@Param("id") Long id, @Param("userId") Long userId);

    @Query("SELECT COUNT(i) FROM Incident i JOIN Monitor m ON i.monitorId = m.id WHERE m.userId = :userId AND i.status = 'OPEN'")
    long countOpenByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(i) FROM Incident i JOIN Monitor m ON i.monitorId = m.id WHERE m.userId = :userId AND i.status = 'RESOLVED'")
    long countResolvedByUserId(@Param("userId") Long userId);
}