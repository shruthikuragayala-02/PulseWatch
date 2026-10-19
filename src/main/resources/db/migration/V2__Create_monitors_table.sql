-- V2__Create_monitors_table.sql
CREATE TABLE IF NOT EXISTS monitors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    interval_minutes INTEGER NOT NULL DEFAULT 5,
    timeout_ms INTEGER NOT NULL DEFAULT 5000,
    failure_threshold INTEGER NOT NULL DEFAULT 2,
    enabled BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN',
    last_checked_at TIMESTAMP,
    last_status_code INTEGER,
    last_response_time_ms BIGINT,
    last_failure_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_monitors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_monitors_user_id ON monitors(user_id);
CREATE INDEX idx_monitors_enabled ON monitors(enabled);
CREATE INDEX idx_monitors_status ON monitors(status);
CREATE INDEX idx_monitors_last_checked_at ON monitors(last_checked_at);