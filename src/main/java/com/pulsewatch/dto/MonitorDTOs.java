package com.pulsewatch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class MonitorDTOs {

    public static class CreateMonitorRequest {
        @NotBlank
        private String name;

        @NotBlank
        @Pattern(regexp = "^https?://.*", message = "URL must start with http:// or https://")
        private String url;

        private Integer intervalMinutes = 5;
        private Integer timeoutMs = 5000;
        private Integer failureThreshold = 2;

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        public Integer getIntervalMinutes() { return intervalMinutes; }
        public void setIntervalMinutes(Integer intervalMinutes) { this.intervalMinutes = intervalMinutes; }
        public Integer getTimeoutMs() { return timeoutMs; }
        public void setTimeoutMs(Integer timeoutMs) { this.timeoutMs = timeoutMs; }
        public Integer getFailureThreshold() { return failureThreshold; }
        public void setFailureThreshold(Integer failureThreshold) { this.failureThreshold = failureThreshold; }
    }

    public static class UpdateMonitorRequest {
        private String name;
        private String url;
        private Integer intervalMinutes;
        private Integer timeoutMs;
        private Integer failureThreshold;
        private Boolean enabled;

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        public Integer getIntervalMinutes() { return intervalMinutes; }
        public void setIntervalMinutes(Integer intervalMinutes) { this.intervalMinutes = intervalMinutes; }
        public Integer getTimeoutMs() { return timeoutMs; }
        public void setTimeoutMs(Integer timeoutMs) { this.timeoutMs = timeoutMs; }
        public Integer getFailureThreshold() { return failureThreshold; }
        public void setFailureThreshold(Integer failureThreshold) { this.failureThreshold = failureThreshold; }
        public Boolean getEnabled() { return enabled; }
        public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    }

    public static class MonitorResponse {
        private Long id;
        private String name;
        private String url;
        private Integer intervalMinutes;
        private Integer timeoutMs;
        private Integer failureThreshold;
        private Boolean enabled;
        private String status;
        private java.time.LocalDateTime lastCheckedAt;
        private Integer lastStatusCode;
        private Long lastResponseTimeMs;
        private String lastFailureReason;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        public Integer getIntervalMinutes() { return intervalMinutes; }
        public void setIntervalMinutes(Integer intervalMinutes) { this.intervalMinutes = intervalMinutes; }
        public Integer getTimeoutMs() { return timeoutMs; }
        public void setTimeoutMs(Integer timeoutMs) { this.timeoutMs = timeoutMs; }
        public Integer getFailureThreshold() { return failureThreshold; }
        public void setFailureThreshold(Integer failureThreshold) { this.failureThreshold = failureThreshold; }
        public Boolean getEnabled() { return enabled; }
        public void setEnabled(Boolean enabled) { this.enabled = enabled; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public java.time.LocalDateTime getLastCheckedAt() { return lastCheckedAt; }
        public void setLastCheckedAt(java.time.LocalDateTime lastCheckedAt) { this.lastCheckedAt = lastCheckedAt; }
        public Integer getLastStatusCode() { return lastStatusCode; }
        public void setLastStatusCode(Integer lastStatusCode) { this.lastStatusCode = lastStatusCode; }
        public Long getLastResponseTimeMs() { return lastResponseTimeMs; }
        public void setLastResponseTimeMs(Long lastResponseTimeMs) { this.lastResponseTimeMs = lastResponseTimeMs; }
        public String getLastFailureReason() { return lastFailureReason; }
        public void setLastFailureReason(String lastFailureReason) { this.lastFailureReason = lastFailureReason; }
        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
        public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(java.time.LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }
}