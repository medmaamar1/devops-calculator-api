# Docker Hub Publishing Guide

This document provides instructions for publishing the DevOps Calculator API Docker image to Docker Hub.

## Overview

Publishing to Docker Hub is required for:
- CI/CD pipeline to push images
- Kubernetes deployment to pull images
- Public access to your containerized application

## Prerequisites

Before publishing to Docker Hub, ensure:

- [ ] Docker is installed and running
- [ ] Docker Hub account is created
- [ ] Docker image builds successfully
- [ ] GitHub Actions workflow is configured

## Step 1: Create Docker Hub Account

1. **Sign Up**
   - Go to https://hub.docker.com/
   - Click "Sign Up"
   - Create account with username and password

2. **Create Repository**
   - Log in to Docker Hub
   - Click "Create Repository"
   - Repository name: `calculator-api`
   - Visibility: Public
   - Click "Create"

Your repository will be: `https://hub.docker.com/r/<your-username>/calculator-api`

## Step 2: Configure GitHub Secrets

1. **Go to GitHub Repository Settings**
   - Navigate to your GitHub repository
   - Go to Settings → Secrets and variables → Actions

2. **Add Docker Username Secret**
   - Click "New repository secret"
   - Name: `DOCKER_USERNAME`
   - Value: Your Docker Hub username
   - Click "Add secret"

3. **Add Docker Password Secret**
   - Click "New repository secret"
   - Name: `DOCKER_PASSWORD`
   - Value: Your Docker Hub password or access token
   - Click "Add secret"

**Note:** For better security, create an access token instead of using your password:
- Go to Docker Hub → Account Settings → Security → Access Tokens
- Click "New Access Token"
- Description: "GitHub Actions"
- Permissions: Read, Write, Delete
- Copy the generated token and use it as `DOCKER_PASSWORD`

## Step 3: Update Dockerfile for Your Username

Update [`Dockerfile`](../Dockerfile:1) to use your Docker Hub username:

```dockerfile
# Update this line in the Build Docker job in CI/CD
# FROM node:18-alpine AS builder
# ...
# Build Docker job should use:
# docker build -t ${{ secrets.DOCKER_USERNAME }}/calculator-api:latest .
```

The CI/CD pipeline already uses `{{ secrets.DOCKER_USERNAME }}/calculator-api:latest` in the build step.

## Step 4: Build and Push Image Manually

### Option A: Using Docker CLI

```bash
# Build the image
docker build -t <your-username>/calculator-api:latest .

# Login to Docker Hub
docker login

# Enter your Docker Hub username and password/token when prompted

# Push the image
docker push <your-username>/calculator-api:latest
```

### Option B: Using CI/CD Pipeline

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "chore: update for Docker Hub publishing"
   git push origin main
   ```

2. **Monitor GitHub Actions**
   - Go to GitHub repository → Actions tab
   - Watch the CI/CD pipeline run
   - The "Build Docker" job will push to Docker Hub

3. **Verify Image on Docker Hub**
   - Go to https://hub.docker.com/r/<your-username>/calculator-api
   - Confirm the image is visible
   - Check the tags (should have `latest`)

## Step 5: Test Docker Hub Image

### Pull and Run Image

```bash
# Pull the image from Docker Hub
docker pull <your-username>/calculator-api:latest

# Run the container
docker run -p 3000:3000 <your-username>/calculator-api:latest
```

### Test the Application

```bash
# Health check
curl http://localhost:3000/health

# Add two numbers
curl "http://localhost:3000/add?a=5&b=3"

# View metrics
curl http://localhost:3000/metrics
```

## Step 6: Update Kubernetes Deployment

Update [`k8s/deployment.yaml`](../k8s/deployment.yaml:1) to use your Docker Hub image:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: calculator-api
  labels:
    app: calculator-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: calculator-api
  template:
    metadata:
      labels:
        app: calculator-api
    spec:
      containers:
      - name: calculator-api
        image: <your-username>/calculator-api:latest  # Update this line
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 3000
        # ... rest of configuration
```

## Step 7: Deploy to Kubernetes with Docker Hub Image

```bash
# Create Kind cluster
kind create cluster --name calculator-cluster

# Load Docker image into Kind (if using local image)
# OR pull from Docker Hub (if using remote image)
kubectl pull <your-username>/calculator-api:latest

# Apply Kubernetes manifests
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Verify deployment
kubectl get pods
kubectl get services
```

## Step 8: Verify Docker Hub Integration

### Check Image Layers

```bash
# View image history
docker history <your-username>/calculator-api:latest

# View image details
docker inspect <your-username>/calculator-api:latest
```

### Check Pull Count

Go to Docker Hub repository page to see:
- Pull count
- Last updated date
- Image size
- Number of tags

## Troubleshooting

### Docker Login Fails

**Issue:** `docker login` fails with authentication error

**Solutions:**
1. Verify username and password are correct
2. Use access token instead of password
3. Check if Docker Hub account is active
4. Try logging out and back in:
   ```bash
   docker logout
   docker login
   ```

### Push Fails

**Issue:** `docker push` fails with permission denied

**Solutions:**
1. Verify you're pushing to correct repository
2. Check repository name matches image name
3. Ensure repository visibility is Public
4. Verify you have write permissions

### Image Pull Fails

**Issue:** Kubernetes cannot pull image from Docker Hub

**Solutions:**
1. Verify image name is correct in deployment.yaml
2. Check imagePullPolicy setting
3. Ensure Kind cluster can access Docker Hub
4. Try pulling manually first:
   ```bash
   docker pull <your-username>/calculator-api:latest
   ```

### CI/CD Pipeline Fails at Docker Push

**Issue:** GitHub Actions cannot push to Docker Hub

**Solutions:**
1. Verify GitHub secrets are configured correctly
2. Check secret names: `DOCKER_USERNAME` and `DOCKER_PASSWORD`
3. Ensure access token has correct permissions (Read, Write, Delete)
4. Review GitHub Actions logs for specific error

## Best Practices

### Image Tagging

Use semantic versioning for tags:
```bash
# Build with version tag
docker build -t <your-username>/calculator-api:1.0.0 .
docker build -t <your-username>/calculator-api:latest .

# Push both tags
docker push <your-username>/calculator-api:1.0.0
docker push <your-username>/calculator-api:latest
```

### Image Optimization

The Dockerfile already includes optimization:
- Multi-stage build
- Alpine Linux base image
- Only production dependencies
- .dockerignore to exclude unnecessary files

### Security

- Use non-root user (already implemented)
- Minimal base image
- Regular security updates
- Scan images for vulnerabilities:
  ```bash
  docker scan <your-username>/calculator-api:latest
  ```

## Documentation

Update project documentation to reference your Docker Hub image:

### README.md

Update [`README.md`](../README.md:1) with your Docker Hub username:

```markdown
## Docker Hub

Pull the image from Docker Hub:

```bash
docker pull <your-username>/calculator-api:latest
docker run -p 3000:3000 <your-username>/calculator-api:latest
```

Docker Hub repository: https://hub.docker.com/r/<your-username>/calculator-api
```

### Deployment Guide

Update [`evidence/deployment-guide.md`](../evidence/deployment-guide.md:1) with your Docker Hub username.

## Verification Checklist

Before considering Docker Hub publishing complete:

- [ ] Docker Hub account created
- [ ] Repository created on Docker Hub
- [ ] GitHub secrets configured
- [ ] Image builds successfully
- [ ] Image pushes to Docker Hub
- [ ] Image is visible on Docker Hub
- [ ] Image can be pulled and run
- [ ] Application works when run from Docker Hub image
- [ ] Kubernetes deployment updated to use Docker Hub image
- [ ] Documentation updated with Docker Hub references

## Next Steps

After publishing to Docker Hub:

1. **Test deployment** with Docker Hub image
2. **Update Kubernetes manifests** to use Docker Hub image
3. **Deploy to Kind cluster** using Docker Hub image
4. **Verify all endpoints** work correctly
5. **Document the process** in final report
6. **Include Docker Hub repository URL** in presentation

---

**Last Updated:** January 15, 2026
**Docker Hub:** https://hub.docker.com/
**Image Name:** calculator-api
**Image Tag:** latest
