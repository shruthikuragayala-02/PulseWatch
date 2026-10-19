package com.pulsewatch.service;

import com.pulsewatch.dto.MonitorDTOs;
import com.pulsewatch.entity.Monitor;
import com.pulsewatch.repository.MonitorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MonitorService {

    private final MonitorRepository monitorRepository;

    public MonitorService(MonitorRepository monitorRepository) {
        this.monitorRepository = monitorRepository;
    }

    @Transactional
    public MonitorDTOs.MonitorResponse createMonitor(Long userId, MonitorDTOs.CreateMonitorRequest request) {
        if (monitorRepository.countByUserId(userId) >= 50) {
            throw new RuntimeException("Maximum monitor limit reached (50 monitors per user)");
        }

        Monitor monitor = new Monitor();
        monitor.setUserId(userId);
        monitor.setName(request.getName());
        monitor.setUrl(request.getUrl());
        monitor.setIntervalMinutes(request.getIntervalMinutes());
        monitor.setTimeoutMs(request.getTimeoutMs());
        monitor.setFailureThreshold(request.getFailureThreshold());
        monitor.setEnabled(true);

        Monitor saved = monitorRepository.save(monitor);
        return toResponse(saved);
    }

    public List<MonitorDTOs.MonitorResponse> getMonitorsByUser(Long userId) {
        return monitorRepository.findByUserId(userId).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public MonitorDTOs.MonitorResponse getMonitorById(Long monitorId, Long userId) {
        Monitor monitor = monitorRepository.findByIdAndUserId(monitorId, userId)
            .orElseThrow(() -> new RuntimeException("Monitor not found or access denied"));
        return toResponse(monitor);
    }

    @Transactional
    public MonitorDTOs.MonitorResponse updateMonitor(Long monitorId, Long userId, MonitorDTOs.UpdateMonitorRequest request) {
        Monitor monitor = monitorRepository.findByIdAndUserId(monitorId, userId)
            .orElseThrow(() -> new RuntimeException("Monitor not found or access denied"));

        if (request.getName() != null) monitor.setName(request.getName());
        if (request.getUrl() != null) monitor.setUrl(request.getUrl());
        if (request.getIntervalMinutes() != null) monitor.setIntervalMinutes(request.getIntervalMinutes());
        if (request.getTimeoutMs() != null) monitor.setTimeoutMs(request.getTimeoutMs());
        if (request.getFailureThreshold() != null) monitor.setFailureThreshold(request.getFailureThreshold());
        if (request.getEnabled() != null) monitor.setEnabled(request.getEnabled());

        Monitor updated = monitorRepository.save(monitor);
        return toResponse(updated);
    }

    @Transactional
    public void pauseMonitor(Long monitorId, Long userId) {
        Monitor monitor = monitorRepository.findByIdAndUserId(monitorId, userId)
            .orElseThrow(() -> new RuntimeException("Monitor not found or access denied"));
        monitor.setEnabled(false);
        monitorRepository.save(monitor);
    }

    @Transactional
    public void resumeMonitor(Long monitorId, Long userId) {
        Monitor monitor = monitorRepository.findByIdAndUserId(monitorId, userId)
            .orElseThrow(() -> new RuntimeException("Monitor not found or access denied"));
        monitor.setEnabled(true);
        monitorRepository.save(monitor);
    }

    @Transactional
    public void deleteMonitor(Long monitorId, Long userId) {
        Monitor monitor = monitorRepository.findByIdAndUserId(monitorId, userId)
            .orElseThrow(() -> new RuntimeException("Monitor not found or access denied"));
        monitorRepository.delete(monitor);
    }

    public List<Monitor> getEnabledMonitors() {
        return monitorRepository.findByEnabledTrue();
    }

    private MonitorDTOs.MonitorResponse toResponse(Monitor monitor) {
        MonitorDTOs.MonitorResponse response = new MonitorDTOs.MonitorResponse();
        response.setId(monitor.getId());
        response.setName(monitor.getName());
        response.setUrl(monitor.getUrl());
        response.setIntervalMinutes(monitor.getIntervalMinutes());
        response.setTimeoutMs(monitor.getTimeoutMs());
        response.setFailureThreshold(monitor.getFailureThreshold());
        response.setEnabled(monitor.getEnabled());
        response.setStatus(monitor.getStatus());
        response.setLastCheckedAt(monitor.getLastCheckedAt());
        response.setLastStatusCode(monitor.getLastStatusCode());
        response.setLastResponseTimeMs(monitor.getLastResponseTimeMs());
        response.setLastFailureReason(monitor.getLastFailureReason());
        response.setCreatedAt(monitor.getCreatedAt());
        response.setUpdatedAt(monitor.getUpdatedAt());
        return response;
    }
}