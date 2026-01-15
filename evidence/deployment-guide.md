# Deployment Guide

This document provides step-by-step instructions for deploying the DevOps Calculator API project.

## Prerequisites

Ensure you have the following installed:
- Node.js 18 or higher
- Docker and Docker Compose
- Kind (Kubernetes in Docker)
- kubectl
- Git
- A GitHub account
- A Docker Hub account

## 1. Local Development Setup

### Install Dependencies

```bash
cd devops-calculator-api
npm install
```

### Run Tests

```bash
npm test
```

Expected output: All tests pass with 93.75% coverage

### Start Application Locally

```bash
npm start
```

The API will be available at `http://localhost:3000`

### Test API Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Add two numbers
curl "http://localhost:3000/add?a=5&b=3"

# View metrics
curl http://localhost:3000/metrics
```

## 2. Docker Deployment

### Build Docker Image

```bash
docker build -t calculator-api:latest .
```

### Run Docker Container

```bash
docker run -p 3000:3000 calculator-api:latest
```

### Using Docker Compose

```bash
# Start
docker-compose up

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

### Test Docker Deployment

```bash
curl http://localhost:3000/health
```

## 3. GitHub Repository Setup

### Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: DevOps Calculator API"
```

### Create GitHub Repository

1. Go to GitHub and create a new repository
2. Add remote origin:
```bash
git remote add origin https://github.com/your-username/devops-calculator-api.git
git branch -M main
git push -u origin main
```

### Configure GitHub Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add the following secrets:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token

## 4. CI/CD Pipeline

The GitHub Actions workflow will run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` branch

### Pipeline Stages

1. **Build and Test**: Install dependencies and run tests
2. **SAST Scan**: Run npm audit and Semgrep
3. **Build Docker**: Build and push Docker image
4. **DAST Scan**: Run OWASP ZAP security scan
5. **Deploy**: Deploy to Kind cluster (main branch only)

### Monitor Pipeline

Go to GitHub Actions tab to monitor pipeline execution.

## 5. Kubernetes Deployment with Kind

### Install Kind

```bash
# On macOS/Linux with Go
go install sigs.k8s.io/kind@v0.20.0

# Or using brew (macOS)
brew install kind

# Or using chocolatey (Windows)
choco install kind
```

### Create Kind Cluster

```bash
kind create cluster --name calculator-cluster
```

### Load Docker Image into Kind

```bash
kind load docker-image calculator-api:latest --name calculator-cluster
```

### Deploy to Kubernetes

```bash
# Apply ConfigMap
kubectl apply -f k8s/configmap.yaml

# Apply Deployment
kubectl apply -f k8s/deployment.yaml

# Apply Service
kubectl apply -f k8s/service.yaml
```

### Verify Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# View logs
kubectl logs -l app=calculator-api

# Describe deployment
kubectl describe deployment calculator-api
```

Expected output: 2 pods running, service created

### Access the API

```bash
# Port forward to access API
kubectl port-forward service/calculator-api-service 8080:80
```

Now access at `http://localhost:8080`

### Test Kubernetes Deployment

```bash
# Health check
curl http://localhost:8080/health

# Add two numbers
curl "http://localhost:8080/add?a=5&b=3"

# View metrics
curl http://localhost:8080/metrics
```

## 6. Clean Up

### Delete Kubernetes Deployment

```bash
kubectl delete -f k8s/
```

### Delete Kind Cluster

```bash
kind delete cluster --name calculator-cluster
```

### Stop Docker Container

```bash
docker-compose down
```

Or if using docker run:
```bash
docker stop <container-id>
docker rm <container-id>
```

## 7. Evidence Collection

### Observability Evidence

#### Structured Logs

Logs are output in JSON format:
```json
{
  "timestamp": "2026-01-15T17:59:01.436Z",
  "level": "info",
  "message": "Incoming request",
  "method": "GET",
  "path": "/health",
  "traceId": "8ca9413b-a366-4246-9209-ff251b8001fd"
}
```

#### Metrics

Access metrics endpoint:
```bash
curl http://localhost:3000/metrics
```

Output:
```
# HELP http_requests_total Total number of requests
# TYPE http_requests_total counter
http_requests_total{path="/health"} 1
http_requests_total{path="/add"} 2

# HELP http_response_time_ms Response time in milliseconds
# TYPE http_response_time_ms gauge
http_response_time_ms{path="/health"} 9.00
http_response_time_ms{path="/add"} 1.50
```

#### Request Tracing

Each response includes a trace ID:
```json
{
  "operation": "add",
  "a": 5,
  "b": 3,
  "result": 8,
  "traceId": "19153557-0e02-46b0-a964-008e93cf18db"
}
```

### Security Evidence

#### SAST Scan Results

After CI/CD pipeline runs, download artifacts:
1. Go to GitHub Actions workflow run
2. Download `sast-results` artifact
3. Review `semgrep-report.json` and `npm-audit-report.json`

#### DAST Scan Results

After CI/CD pipeline runs, download artifacts:
1. Go to GitHub Actions workflow run
2. Download `dast-results` artifact
3. Review `zap-report.html`

## 8. Troubleshooting

### Port Already in Use

```bash
# Change port
PORT=3001 npm start
```

### Docker Build Fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t calculator-api:latest .
```

### Kubernetes Pods Not Starting

```bash
# Check pod status
kubectl get pods

# Describe pod for details
kubectl describe pod <pod-name>

# View pod logs
kubectl logs <pod-name>
```

### CI/CD Pipeline Fails

1. Check GitHub Actions logs for specific error
2. Verify GitHub secrets are configured correctly
3. Ensure Docker Hub credentials are valid
4. Check if Kind cluster is available (for deploy job)

## 9. GitHub Issues and Pull Requests

### Create GitHub Issues

1. Go to repository Issues tab
2. Click "New Issue"
3. Create issues for each major task:
   - Implement Calculator API backend
   - Add observability features
   - Implement security scanning
   - Containerize application
   - Deploy to Kubernetes
   - Write documentation

### Create Pull Requests

1. Create a new branch:
```bash
git checkout -b feature/backend-implementation
```

2. Make changes and commit:
```bash
git add .
git commit -m "feat: implement calculator API with observability"
```

3. Push and create PR:
```bash
git push origin feature/backend-implementation
```

4. Go to GitHub and create Pull Request
5. Include:
   - Clear description of changes
   - Testing instructions
   - Related issue number

### Peer Review

1. Review classmate's PR
2. Provide constructive feedback
3. See [`CONTRIBUTING.md`](../CONTRIBUTING.md:1) for guidelines

## 10. Final Checklist

Before submission, ensure:

- [ ] All tests pass locally
- [ ] Docker image builds successfully
- [ ] Application runs in Docker container
- [ ] Application deploys to Kind cluster
- [ ] All API endpoints work correctly
- [ ] Metrics endpoint returns data
- [ ] Logs are structured JSON
- [ ] Trace IDs are present in responses
- [ ] CI/CD pipeline runs successfully
- [ ] SAST scan results are captured
- [ ] DAST scan results are captured
- [ ] GitHub repository is public
- [ ] README.md is comprehensive
- [ ] Final report is complete
- [ ] Presentation slides are ready
- [ ] Peer review is completed

## 11. Next Steps

After deployment:

1. **Create GitHub Issues** for tracking tasks
2. **Open Pull Requests** for each major feature
3. **Perform peer reviews** with classmates
4. **Capture evidence** of all features
5. **Update documentation** as needed
6. **Prepare for presentation**
7. **Submit project** according to course requirements

---

**Last Updated:** January 15, 2026
**Project Version:** 1.0.0
