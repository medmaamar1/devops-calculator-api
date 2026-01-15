# Quick Start Guide

This guide will help you get the DevOps Calculator API up and running in minutes.

## Prerequisites

Ensure you have the following installed:
- Node.js 18 or higher
- npm (comes with Node.js)
- Docker
- Docker Compose
- Git

## Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd devops-calculator-api

# Install dependencies
npm install
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### 3. Start the Application

```bash
# Start the server
npm start
```

The API will be available at `http://localhost:3000`

### 4. Test the API

Open a new terminal and test the endpoints:

```bash
# Health check
curl http://localhost:3000/health

# Add two numbers
curl http://localhost:3000/add?a=5&b=3

# Subtract two numbers
curl http://localhost:3000/subtract?a=10&b=4

# Multiply two numbers
curl http://localhost:3000/multiply?a=6&b=7

# Divide two numbers
curl http://localhost:3000/divide?a=20&b=4

# View metrics
curl http://localhost:3000/metrics
```

## Docker Setup

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t calculator-api:latest .

# Run the container
docker run -p 3000:3000 calculator-api:latest
```

### Using Docker Compose

```bash
# Start with Docker Compose
docker-compose up

# Stop Docker Compose
docker-compose down

# View logs
docker-compose logs -f
```

## Kubernetes Setup (Kind)

### Install Kind

If you don't have Kind installed:

```bash
# On macOS/Linux with Go
go install sigs.k8s.io/kind@v0.20.0

# Or using brew (macOS)
brew install kind

# Or using chocolatey (Windows)
choco install kind
```

### Create and Deploy

```bash
# Create a Kind cluster
kind create cluster --name calculator-cluster

# Load the Docker image into Kind
kind load docker-image calculator-api:latest --name calculator-cluster

# Deploy to Kubernetes
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Check the deployment
kubectl get pods
kubectl get services

# Port forward to access the API
kubectl port-forward service/calculator-api-service 8080:80
```

Now test the API at `http://localhost:8080`

### Clean Up

```bash
# Delete the deployment
kubectl delete -f k8s/

# Delete the Kind cluster
kind delete cluster --name calculator-cluster
```

## Observability

### View Logs

```bash
# Local development
# Logs are printed to console in JSON format

# Docker
docker logs calculator-api

# Kubernetes
kubectl logs -l app=calculator-api
```

### View Metrics

```bash
# Access the metrics endpoint
curl http://localhost:3000/metrics
```

### Request Tracing

Each API response includes a `traceId` for tracking:

```json
{
  "operation": "add",
  "a": 5,
  "b": 3,
  "result": 8,
  "traceId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## CI/CD Setup

### GitHub Secrets

Configure these secrets in your GitHub repository settings:

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add the following secrets:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token

### Trigger the Pipeline

The CI/CD pipeline runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` branch

## Troubleshooting

### Port Already in Use

```bash
# Change the port
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

### Tests Failing

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Run tests with verbose output
npm test -- --verbose
```

## Next Steps

- Read the full [README.md](README.md:1) for detailed documentation
- Review the [project plan](plans/devops-project-plan.md:1) for architecture details
- Check the [final report](docs/final-report.md:1) for implementation details
- See [presentation slides](docs/presentation.md:1) for project overview

## Support

If you encounter issues:
1. Check the [README.md](README.md:1) troubleshooting section
2. Review the [CONTRIBUTING.md](CONTRIBUTING.md:1) for guidelines
3. Open an issue on GitHub

## Happy Coding! 🚀
