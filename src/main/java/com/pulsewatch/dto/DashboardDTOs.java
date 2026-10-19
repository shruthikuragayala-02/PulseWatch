package com.pulsewatch.dto;

import java.time.LocalDateTime;

public class DashboardDTOs {

    public static class DashboardSummary {
        private int totalMonitors;
        private int monitorsUp;
        private int monitorsDown;
        private int monitorsUnknown;
        private int openIncidents;
        private int resolvedIncidents;
        private double uptimePercentage;

        // Getters and Setters
        public int getTotalMonitors() { return totalMonitors; }
        public void setTotalMonitors(int totalMonitors) { this.totalMonitors = totalMonitors; }
        public int getMonitorsUp() { return monitorsUp; }
        public void setMonitorsUp(int monitorsUp) { this.monitorsUp = monitorsUp; }
        public int getMonitorsDown() { return monitorsDown; }
        public void setMonitorsDown(int monitorsDown) { this.monitorsDown = monitorsDown; }
        public int getMonitorsUnknown() { return monitorsUnknown; }
        public void setMonitorsUnknown(int monitorsUnknown) { this.monitorsUnknown = monitorsUnknown; }
        public int getOpenIncidents() { return openIncidents; }
        public void setOpenIncidents(int openIncidents) { this.openIncidents = openIncidents; }
        public int getResolvedIncidents() { return resolvedIncidents; }
        public void setResolvedIncidents(int resolvedIncidents) { this.resolvedIncidents = resolvedIncidents; }
        public double getUptimePercentage() { return uptimePercentage; }
        public void setUptimePercentage(double uptimePercentage) { this.uptimePercentage = uptimePercentage; }
    }

    public static class UptimeStats {
        private String period;
        private double uptimePercentage;
        private int totalChecks;
        private int successfulChecks;

        // Getters and Setters
        public String getPeriod() { return period; }
        public void setPeriod(String period) { this.period = period; }
        public double getUptimePercentage() { return uptimePercentage; }
        public void setUptimePercentage(double uptimePercentage) { this.uptimePercentage = uptimePercentage; }
        public int getTotalChecks() { return totalChecks; }
        public void setTotalChecks(int totalChecks) { this.totalChecks = totalChecks; }
        public int getSuccessfulChecks() { return successfulChecks; }
        public void setSuccessfulChecks(int successfulChecks) { this.successfulChecks = successfulChecks; }
    }

    public static class RecentFailedCheck {
        private Long monitorId;
        private String monitorName;
        private String monitorUrl;
        private LocalDateTime checkedAt;
        private String failureReason;

        // Getters and Setters
        public Long getMonitorId() { return monitorId; }
        public void setMonitorId(Long monitorId) { this.monitorId = monitorId; }
        public String getMonitorName() { return monitorName; }
        public void setMonitorName(String monitorName) { this.monitorName = monitorName; }
        public String getMonitorUrl() { return monitorUrl; }
        public void setMonitorUrl(String monitorUrl) { this.monitorUrl = monitorUrl; }
        public LocalDateTime getCheckedAt() { return checkedAt; }
        public void setCheckedAt(LocalDateTime checkedAt) { this.checkedAt = checkedAt; }
        public String getFailureReason() { return failureReason; }
        public void setFailureReason(String failureReason) { this.failureReason = failureReason; }
    }
}