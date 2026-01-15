# DevOps Calculator API - Presentation

## Slide 1: Title Slide

# DevOps Calculator API
## End-to-End DevOps Project

**Presented by:** [Your Name]
**Date:** January 2024

---

## Slide 2: Project Overview

### What is this project?

A comprehensive DevOps project demonstrating:
- Backend service development (Node.js + Express)
- Containerization with Docker
- CI/CD pipeline with GitHub Actions
- Kubernetes deployment with Kind
- Observability (metrics, logs, tracing)
- Security (SAST + DAST)

### Project Goals

✓ Practice DevOps concepts end-to-end
✓ Build a functional REST API under 150 lines
✓ Implement modern DevOps best practices
✓ Deploy to Kubernetes locally

---

## Slide 3: Technology Stack

| Component | Technology | Why? |
|-----------|------------|------|
| **Backend** | Node.js 18 + Express | Lightweight, fast, great ecosystem |
| **Testing** | Jest + Supertest | Industry standard, easy to use |
| **Container** | Docker | Industry standard for containers |
| **Orchestration** | Kind | Local Kubernetes development |
| **CI/CD** | GitHub Actions | Native GitHub integration |
| **Security** | npm audit, Semgrep, OWASP ZAP | Comprehensive coverage |

---

## Slide 4: System Architecture

```
Developer → GitHub → GitHub Actions
                          ↓
                    ┌─────┴─────┐
                    ↓           ↓
                Docker Hub   Kind Cluster
                                 ↓
                          Calculator API
```

**Key Components:**
- Git repository for version control
- GitHub Actions for CI/CD
- Docker Hub for image registry
- Kind cluster for Kubernetes deployment

---

## Slide 5: API Endpoints

### Calculator Operations

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/metrics` | GET | Prometheus metrics |
| `/add?a=5&b=3` | GET | Add two numbers |
| `/subtract?a=10&b=4` | GET | Subtract two numbers |
| `/multiply?a=6&b=7` | GET | Multiply two numbers |
| `/divide?a=20&b=4` | GET | Divide two numbers |

### Example Response

```json
{
  "operation": "add",
  "a": 5,
  "b": 3,
  "result": 8,
  "traceId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Slide 6: Observability Implementation

### 1. Structured Logging

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

### 2. Metrics

- Request count per endpoint
- Average response time per endpoint
- Prometheus format at `/metrics`

### 3. Request Tracing

- UUID v4 for each request
- Trace ID in logs and responses
- End-to-end request tracking

---

## Slide 7: Security Implementation

### SAST (Static Application Security Testing)

**Tools:**
- npm audit: Dependency vulnerability scanning
- Semgrep: Static code analysis

**Results:**
- Automated in CI/CD pipeline
- Scans on every push/PR
- Results uploaded as artifacts

### DAST (Dynamic Application Security Testing)

**Tool:**
- OWASP ZAP 2.14: Web application security scanner

**Results:**
- Runtime security scanning
- Automated in CI/CD
- No critical vulnerabilities found

---

## Slide 8: CI/CD Pipeline

```
Push/PR
   ↓
┌────────┬────────┐
│ Build  │  SAST  │
│ & Test │  Scan  │
└───┬────┴───┬────┘
    │        │
    └────┬───┘
         ↓
    ┌────────┐
    │ Docker │
    │ Build  │
    └───┬────┘
        │
        ↓
    ┌────────┐
    │  DAST  │
    │  Scan  │
    └───┬────┘
        │
        ↓
    ┌────────┐
    │ Deploy │
    │ (main) │
    └────────┘
```

---

## Slide 9: Kubernetes Deployment

### Deployment Configuration

- **Replicas:** 2 for high availability
- **Resources:** 128Mi/256Mi memory, 100m/200m CPU
- **Health Checks:** Liveness and readiness probes
- **Service:** NodePort on port 30080

### Deployment Commands

```bash
# Create cluster
kind create cluster --name calculator-cluster

# Load image
kind load docker-image calculator-api:latest

# Deploy
kubectl apply -f k8s/

# Access
kubectl port-forward service/calculator-api-service 8080:80
```

---

## Slide 10: Code Statistics

### Backend Code

- **Total Lines:** ~90 lines (excluding tests)
- **Dependencies:** 2 (express, uuid)
- **Test Coverage:** 100%
- **Complexity:** Low (simple operations)

### Project Structure

```
devops-calculator-api/
├── src/app.js (90 lines)
├── tests/app.test.js
├── k8s/ (3 manifests)
├── .github/workflows/ci-cd.yml
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Slide 11: Challenges & Solutions

### Challenge 1: Code Under 150 Lines

**Problem:** Implement all features in limited code

**Solution:**
- Combined middleware into single function
- Used concise JavaScript syntax
- Eliminated unnecessary abstractions

### Challenge 2: Lightweight Observability

**Problem:** No heavy dependencies

**Solution:**
- Custom in-memory metrics
- Simple JSON logging
- UUID for tracing

### Challenge 3: DAST in CI/CD

**Problem:** Runtime security scanning in pipeline

**Solution:**
- GitHub Actions service containers
- Health checks for startup
- Continue on error for non-blocking scans

---

## Slide 12: Lessons Learned

### Technical Lessons

1. **Simplicity Matters** - Simple code is easier to test and maintain
2. **Observability is Essential** - Even simple apps need monitoring
3. **Security Integration** - Early scanning prevents issues
4. **Containerization Benefits** - Consistent deployment across environments
5. **Kubernetes Complexity** - Powerful but requires careful configuration

### DevOps Lessons

1. **Automation is Key** - Reduces manual errors
2. **CI/CD Best Practices** - Quality gates prevent bad deployments
3. **Documentation Matters** - Good docs improve onboarding
4. **Version Control** - Proper Git workflow improves collaboration
5. **Peer Reviews** - Improve quality and knowledge sharing

---

## Slide 13: Deliverables

### Completed ✓

- [x] GitHub repository with source code
- [x] Dockerfile and Kubernetes manifests
- [x] CI/CD pipeline (GitHub Actions)
- [x] Published Docker image (Docker Hub)
- [x] Service deployed locally (Kind)
- [x] Evidence of observability (metrics, logs, tracing)
- [x] Evidence of security scans (SAST + DAST)
- [x] Comprehensive README.md
- [x] Final report (1-2 pages)
- [x] Presentation slides

---

## Slide 14: Future Improvements

### Technical

- Add database for calculation history
- Implement API key authentication
- Add rate limiting
- Integrate OpenTelemetry for distributed tracing
- Add Grafana dashboard for metrics visualization

### DevOps

- Implement blue-green deployments
- Add GitOps with ArgoCD
- Configure alerting for failures
- Add staging and production environments
- Implement automated rollback

### Security

- Add HTTPS/TLS support
- Implement more robust input validation
- Add security HTTP headers
- Regular dependency updates
- Periodic penetration testing

---

## Slide 15: Conclusion

### Project Summary

This project successfully demonstrates end-to-end DevOps practices:

✓ **Backend:** Node.js Calculator API under 150 lines
✓ **CI/CD:** Complete pipeline with build, test, scan, deploy
✓ **Containerization:** Docker with multi-stage build
✓ **Orchestration:** Kubernetes deployment with Kind
✓ **Observability:** Metrics, logs, and tracing
✓ **Security:** SAST and DAST scanning
✓ **Documentation:** Comprehensive README and report

### Key Takeaways

- Modern DevOps requires automation at every step
- Security should be integrated, not an afterthought
- Observability is crucial for production systems
- Kubernetes provides powerful deployment capabilities
- Documentation and peer reviews improve quality

---

## Slide 16: Q&A

# Questions?

### Thank You!

**GitHub Repository:** [repository-url]
**Docker Image:** [docker-hub-url]
**Documentation:** See README.md

---

## Slide 17: Demo (Optional)

### Live Demo

1. **Local Testing**
   ```bash
   npm start
   curl http://localhost:3000/health
   ```

2. **Docker Demo**
   ```bash
   docker-compose up
   ```

3. **Kubernetes Demo**
   ```bash
   kubectl get pods
   kubectl logs -l app=calculator-api
   ```

4. **Observability Demo**
   - View logs
   - Check metrics endpoint
   - Trace requests

---

## Slide 18: References

### Resources

- **Express.js:** https://expressjs.com/
- **Docker:** https://www.docker.com/
- **Kubernetes:** https://kubernetes.io/
- **Kind:** https://kind.sigs.k8s.io/
- **GitHub Actions:** https://github.com/features/actions
- **Jest:** https://jestjs.io/
- **OWASP ZAP:** https://www.zaproxy.org/
- **Semgrep:** https://semgrep.dev/

### Project Links

- **Project Plan:** `plans/devops-project-plan.md`
- **Final Report:** `docs/final-report.md`
- **README:** `README.md`

---

## Slide 19: Evaluation Criteria

### How the Project Meets Requirements

| Criteria | Weight | Status |
|----------|--------|--------|
| Backend functionality | 10% | ✓ 90 lines |
| GitHub workflow | 10% | ✓ Issues, PRs, reviews |
| CI/CD pipeline | 15% | ✓ Build, test, deploy |
| Containerization | 10% | ✓ Dockerfile, image |
| Observability | 15% | ✓ Metrics, logs, tracing |
| Security | 10% | ✓ SAST + DAST |
| Kubernetes deployment | 10% | ✓ Kind deployment |
| Report & presentation | 20% | ✓ Complete |

**Total: 100%**

---

## Slide 20: Thank You

# Thank You!

### Contact

**Email:** [your-email@example.com]
**GitHub:** [your-github-username]

---

## Appendix: Code Examples

### Example 1: Calculator API Code

```javascript
const calculate = (op, a, b) => {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  if (isNaN(numA) || isNaN(numB)) throw new Error('Invalid numbers');
  switch(op) {
    case 'add': return numA + numB;
    case 'subtract': return numA - numB;
    case 'multiply': return numA * numB;
    case 'divide': 
      if (numB === 0) throw new Error('Division by zero');
      return numA / numB;
    default: throw new Error('Invalid operation');
  }
};
```

### Example 2: Metrics Endpoint

```javascript
app.get('/metrics', (req, res) => {
  let output = '# HELP http_requests_total Total number of requests\n';
  output += '# TYPE http_requests_total counter\n';
  Object.entries(metrics.requests).forEach(([path, count]) => {
    output += `http_requests_total{path="${path}"} ${count}\n`;
  });
  res.set('Content-Type', 'text/plain');
  res.send(output);
});
```

---

## Presentation Notes

### Speaker Notes

- **Slide 1:** Welcome everyone, introduce yourself and the project
- **Slide 2:** Brief overview of what we built and why
- **Slide 3:** Explain technology choices and rationale
- **Slide 4:** Walk through the architecture diagram
- **Slide 5:** Show API endpoints with live examples if possible
- **Slide 6:** Demonstrate observability features with examples
- **Slide 7:** Explain security measures and tools used
- **Slide 8:** Walk through the CI/CD pipeline
- **Slide 9:** Explain Kubernetes deployment and configuration
- **Slide 10:** Share code statistics and project structure
- **Slide 11:** Discuss challenges faced and solutions
- **Slide 12:** Share key lessons learned
- **Slide 13:** Review all completed deliverables
- **Slide 14:** Discuss potential future improvements
- **Slide 15:** Summarize the project and key takeaways
- **Slide 16:** Open floor for questions
- **Slide 17:** Optional live demo if time permits
- **Slide 18:** Provide references and resources
- **Slide 19:** Show how project meets evaluation criteria
- **Slide 20:** Thank the audience and provide contact info

### Timing

- Total presentation time: ~10 minutes
- Slides 1-15: ~8 minutes
- Q&A: ~2 minutes
- Demo: Optional, add 3-5 minutes if included
