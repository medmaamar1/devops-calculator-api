# DevOps Calculator API - Final Project Report

## Architecture Overview
The project implements a RESTful Calculator API using **Node.js** and **Express**. It is designed with a microservices-ready approach, containerized with **Docker**, and orchestrated with **Kubernetes (Kind)**. The architecture follows modern DevOps principles, integrating automated testing, security scanning, and observability.

## Tools and Technologies
- **Backend**: Node.js, Express
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes, Kind, kubectl
- **CI/CD**: GitHub Actions
- **Security**: npm audit (Dependencies), Semgrep (SAST), OWASP ZAP (DAST)
- **Observability**: Prometheus-style metrics, JSON structured logging, UUID tracing

## Observability Implementation
- **Metrics**: A `/metrics` endpoint provides real-time data on request counts and average response times per endpoint.
- **Logs**: Every request and error is logged in a machine-readable JSON format, including timestamps, log levels, and trace IDs.
- **Tracing**: Each incoming request is assigned a unique UUID `traceId`, which is propagated through the logs and returned in the API response for end-to-end request tracking.

## Security Measures
- **SAST**: Automated static analysis runs on every push using Semgrep to catch code-level vulnerabilities and `npm audit` to identify insecure dependencies.
- **DAST**: A dynamic security scan is performed using OWASP ZAP against the running containerized application to identify runtime vulnerabilities like misconfigured headers or common web attacks.

## Kubernetes Setup
The application is deployed to a **Kind** (Kubernetes in Docker) cluster. The setup includes:
- **Deployment**: Configured with 2 replicas, resource limits (CPU/Memory), and health probes (liveness/readiness).
- **Service**: A LoadBalancer service maps port 80 to the internal container port 3000.
- **ConfigMap**: Manages environment-specific configurations like `PORT` and `NODE_ENV`.

## Lessons Learned
- **Context Awareness in GH Actions**: Learned that the `services` block in GitHub Actions has limited access to `secrets`, requiring a refactored approach for DAST setup.
- **CI/CD Robustness**: Discovered the importance of proper exit code handling in security scanners to prevent pipeline blocks while still collecting valuable artifacts.
- **Developer Experience**: Realized how much structured logging and tracing simplifies debugging in a containerized environment.
