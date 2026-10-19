# PulseWatch

Mini production monitoring platform with a Spring Boot backend, React/TypeScript frontend, PostgreSQL, Flyway migrations, and Docker Compose.

## Features
- User registration and JWT authentication
- Monitor CRUD with ownership enforcement
- Manual and scheduled health checks
- Incident tracking and dashboard metrics
- Actuator health endpoint

## Prerequisites
- Java 21
- Maven 3.9+
- Node.js 20+
- Docker Desktop

## Setup
1. Copy `.env.example` to `.env` and set `DB_PASSWORD` and `JWT_SECRET`.
2. Start services: `docker compose up -d --build`
3. Backend: http://localhost:8080
4. Frontend: `cd frontend && npm install && npm run dev`

## Testing
- Backend: `mvn test`
- Frontend: `cd frontend && npm run build`

## Docker
- `docker compose up -d --build`
- Health: `http://localhost:8080/actuator/health`
