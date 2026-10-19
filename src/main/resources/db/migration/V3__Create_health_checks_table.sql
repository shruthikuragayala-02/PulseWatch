-- V3__Create_health_checks_table.sql
CREATE TABLE IF NOT EXISTS health_checks (
    id BIGSERIAL PRIMARY KEY,
    monitor_id BIGINT NOT NULL,
    checked_at TIMESTAMP NOT NULL,
    status_code INTEGER,
    response_time_ms BIGINT NOT NULL,
    result VARCHAR(20) NOT NULL,
    failure_reason TEXT,
    error_details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_health_checks_monitor FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE
);

CREATE INDEX idx_health_checks_monitor_id ON health_checks(monitor_id);
CREATE INDEX idx_health_checks_checked_at ON health_checks(checked_at);
CREATE INDEX idx_health_checks_result ON health_checks(result);
CREATE INDEX idx_health_checks_monitor_checked ON health_checks(monitor_id, checked_at DESC);