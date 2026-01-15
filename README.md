# DevOps Calculator API

A simple Calculator API built with Node.js and Express, demonstrating DevOps best practices including containerization, CI/CD, observability, security, and Kubernetes deployment.

## Project Overview

This project implements a RESTful Calculator API that performs basic mathematical operations (addition, subtraction, multiplication, division). It serves as a comprehensive DevOps learning project covering the entire software development lifecycle.

### Features

- **RESTful API**: Simple endpoints for mathematical operations
- **Observability**: Structured logging, metrics, and request tracing
- **Security**: SAST and DAST scanning integration
- **Containerization**: Docker and Docker Compose support
- **Orchestration**: Kubernetes deployment with Kind
- **CI/CD**: GitHub Actions pipeline for automation
- **Testing**: Unit tests with Jest

## Technology Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js 18 + Express |
| Testing | Jest + Supertest |
| Containerization | Docker |
| Orchestration | Kind (Kubernetes in Docker) |
| CI/CD | GitHub Actions |
| Security Scanning | npm audit, Semgrep, OWASP ZAP |

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- Kind (Kubernetes in Docker)
- kubectl
- Git

## Installation

### Local Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd devops-calculator-api
```

2. Install dependencies:
```bash
npm install
```

3. Run the application:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Documentation

### Endpoints

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Metrics
```http
GET /metrics
```

Returns Prometheus-formatted metrics including request counts and response times.

#### Calculator Operations

**Add two numbers:**
```http
GET /add?a=5&b=3
```

**Response:**
```json
{
  "operation": "add",
  "a": 5,
  "b": 3,
  "result": 8,
  "traceId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Subtract two numbers:**
```http
GET /subtract?a=10&b=4
```

**Multiply two numbers:**
```http
GET /multiply?a=6&b=7
```

**Divide two numbers:**
```http
GET /divide?a=20&b=4
```

**Error Response:**
```json
{
  "error": "Division by zero",
  "traceId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Docker Usage

### Build Docker Image
```bash
docker build -t calculator-api:latest .
```

### Run Container
```bash
docker run -p 3000:3000 calculator-api:latest
```

### Using Docker Compose
```bash
docker-compose up
```

### Stop Docker Compose
```bash
docker-compose down
```

## Kubernetes Deployment

### Prerequisites

Install Kind:
```bash
go install sigs.k8s.io/kind@v0.20.0
```

### Create Kind Cluster
```bash
kind create cluster --name calculator-cluster
```

### Load Docker Image
```bash
kind load docker-image calculator-api:latest --name calculator-cluster
```

### Deploy to Kubernetes
```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### Check Deployment Status
```bash
kubectl get pods
kubectl get services
kubectl logs -l app=calculator-api
```

### Access the API
```bash
kubectl port-forward service/calculator-api-service 8080:80
```

Then access at `http://localhost:8080`

### Delete Deployment
```bash
kubectl delete -f k8s/
```

### Delete Kind Cluster
```bash
kind delete cluster --name calculator-cluster
```

## Observability

### Structured Logging

All requests and errors are logged in JSON format with the following fields:
- `timestamp`: ISO 8601 timestamp
- `level`: Log level (info, error)
- `message`: Log message
- Additional context (method, path, traceId, etc.)

**Example Log:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Incoming request",
  "method": "GET",
  "path": "/add",
  "traceId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Metrics

Access metrics at `/metrics` endpoint in Prometheus format:
- `http_requests_total`: Total request count per endpoint
- `http_response_time_ms`: Average response time per endpoint

### Request Tracing

Each request includes a unique `traceId` for tracking:
- Generated using UUID v4
- Included in all responses
- Logged throughout the request lifecycle

## Security

### SAST (Static Application Security Testing)

The CI/CD pipeline includes:
- **npm audit**: Scans for dependency vulnerabilities
- **Semgrep**: Performs static code analysis

View SAST results in GitHub Actions artifacts.

### DAST (Dynamic Application Security Testing)

The CI/CD pipeline includes:
- **OWASP ZAP**: Performs runtime security scanning

View DAST results in GitHub Actions artifacts.

## CI/CD Pipeline

The GitHub Actions workflow includes:

1. **Build and Test**: Install dependencies and run tests
2. **SAST Scan**: Run static security analysis
3. **Build Docker**: Build and push Docker image
4. **DAST Scan**: Run dynamic security analysis
5. **Deploy**: Deploy to Kind cluster (main branch only)

### Required Secrets

Configure these secrets in your GitHub repository:
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password/token

## Project Structure

```
devops-calculator-api/
├── src/
│   └── app.js              # Main Express application
├── tests/
│   └── app.test.js         # Unit tests
├── k8s/
│   ├── deployment.yaml     # Kubernetes Deployment
│   ├── service.yaml        # Kubernetes Service
│   └── configmap.yaml      # Configuration
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # GitHub Actions workflow
├── plans/
│   └── devops-project-plan.md  # Project plan
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Local development setup
├── package.json            # Node.js dependencies
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Code Statistics

- **Total Lines**: ~90 lines (excluding tests and comments)
- **Test Coverage**: Comprehensive unit tests
- **Dependencies**: Minimal (Express, uuid)

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change port in environment variable
PORT=3001 npm start
```

**Docker build fails:**
```bash
# Clear Docker cache
docker system prune -a
```

**Kubernetes pods not starting:**
```bash
# Check pod logs
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

## Contributing

This is a DevOps learning project. Contributions should follow these guidelines:

1. Create a new branch for each feature
2. Write tests for new functionality
3. Ensure all tests pass
4. Create a Pull Request with clear description
5. Perform peer review with classmates

## License

MIT License

## Author

DevOps Project - Calculator API

## Acknowledgments

- Express.js framework
- Docker and Kubernetes communities
- GitHub Actions
- OWASP ZAP
- Semgrep
"# DevOps Calculator API Project"  
