# DevOps Calculator API - Final Project Report

## Architecture Overview
The project implements a RESTful Calculator API using **Node.js** and **Express**. The architecture is designed with a "DevOps-first" mindset, prioritizing containerization, observability, and security. It utilizes a microservices-ready structure, even within a single service, by separating middleware concerns (logging, tracing, metrics) from the core business logic. The application is containerized with **Docker** using a multi-stage build for efficiency and safety, and it is orchestrated with **Kubernetes (Kind)** for local development and testing.

## Tools and Technologies
- **Backend Framework**: Node.js v18 with Express for rapid API development.
- **Testing Suite**: Jest for unit testing and Supertest for integration-level API tests.
- **Containerization**: Docker for isolation and Docker Compose for multi-container orchestration during local development.
- **Kubernetes Environment**: Kind (Kubernetes in Docker) for simulating a real-world cluster environment.
- **CI/CD Automation**: GitHub Actions for the entire automation lifecycle (Build -> Test -> Scan -> Deploy).
- **Security Scanners**: npm audit for dependency vulnerability management, Semgrep for Static Application Security Testing (SAST), and OWASP ZAP for Dynamic Application Security Testing (DAST).
- **Observability Stack**: Prometheus-compatible metrics, JSON structured logging for ELK-readiness, and UUID-based request tracing.

## Observability Implementation
The observability strategy follows the "Golden Signals" and "Distributed Tracing" concepts:
- **Metrics**: A custom metrics provider was built to track total request counts and average latencies. This data is exposed via a `/metrics` endpoint in a format compatible with Prometheus, allowing for future integration with dashboards like Grafana.
- **Structured Logging**: All logs are emitted as single-line JSON objects. This ensures they can be easily parsed by log aggregators like Datadog or an ELK (Elasticsearch, Logstash, Kibana) stack. Logs include contextual information such as the HTTP method, status codes, and the unique trace ID.
- **Request Tracing**: To solve the challenge of tracking a request across different modules and containers, a unique UUID `traceId` is generated for every incoming request. This ID is injected into every log entry related to that request and is also sent back to the client in the HTTP response headers.

## Security Measures
A defense-in-depth approach was applied:
- **SAST (Static Analysis)**: Automated scans are integrated into the pipeline. Semgrep analyzes the source code for insecure patterns (e.g., `eval`, insecure random numbers), while `npm audit` checks the dependency tree for known vulnerabilities in third-party libraries.
- **DAST (Dynamic Analysis)**: Using OWASP ZAP, the pipeline performs a "Baseline Scan" against the live running application. This identifies runtime issues like missing security headers (X-Content-Type-Options, etc.), cookie misconfigurations, or common web vulnerabilities that static analysis might miss.
- **Container Security**: The Docker build utilizes a non-root user (`nodejs`) and a minimal Alpine base image to reduce the attack surface and prevent privilege escalation.

## Kubernetes Setup and Reliability
The Kubernetes manifests ([deployment.yaml](file:///c:/Users/OrdiOne/Desktop/Devops/k8s/deployment.yaml), [service.yaml](file:///c:/Users/OrdiOne/Desktop/Devops/k8s/service.yaml)) were designed for high availability:
- **Scaling**: Configured with 2 replicas to demonstrate load balancing and fault tolerance within the Kind cluster.
- **Health Management**: Implemented both `livenessProbes` and `readinessProbes`. The liveness probe ensures the process is healthy, while the readiness probe ensures the API is actually capable of serving traffic before the LoadBalancer routes requests to it.
- **Resource Management**: Explicit CPU and Memory requests/limits (100m/128Mi) are set to prevent "noisy neighbor" issues and ensure predictable performance.

## Challenges and Lessons Learned
One of the primary challenges was the **integration of DAST in a CI environment**. We discovered that the standard GitHub Actions `services` block cannot access repository `secrets`, requiring a refactor to run the container as a background step using `docker run`. Additionally, handling scanner exit codes (like OWASP ZAP's exit 8 for found alerts) taught us how to build pipelines that are informative without becoming bottlenecks for the development flow. Overall, this project highlighted that DevOps is not just about tools, but about the seamless integration of security and observability into the core development cycle.
