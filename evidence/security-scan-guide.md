# Security Scan Evidence Guide

This document provides instructions for capturing evidence of security scans (SAST and DAST) for the DevOps Calculator API project.

## Overview

Security scans are configured in the CI/CD pipeline ([`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml:1)). The pipeline includes:

1. **SAST (Static Application Security Testing)**
   - npm audit: Scans npm dependencies for known vulnerabilities
   - Semgrep: Performs static code analysis for security issues

2. **DAST (Dynamic Application Security Testing)**
   - OWASP ZAP 2.14: Performs runtime security scanning

## Prerequisites

Before capturing security scan evidence, ensure:

- [ ] GitHub repository is created and code is pushed
- [ ] GitHub Actions workflow is enabled
- [ ] CI/CD pipeline has run at least once
- [ ] Docker Hub credentials are configured as GitHub secrets

## Capturing SAST Evidence

### Method 1: From GitHub Actions Artifacts

1. **Run CI/CD Pipeline**
   - Push code to GitHub or create a Pull Request
   - Wait for pipeline to complete

2. **Download SAST Artifacts**
   - Go to GitHub repository → Actions tab
   - Click on the latest workflow run
   - Scroll to "Artifacts" section at the bottom
   - Download `sast-results` artifact

3. **Extract Artifact**
   ```bash
   # Extract the downloaded zip file
   unzip sast-results.zip -d security-evidence/
   ```

4. **Review SAST Results**

   **npm audit report** (`npm-audit-report.json`):
   ```json
   {
     "vulnerabilities": {
       "info": 0,
       "low": 0,
       "moderate": 0,
       "high": 0,
       "critical": 0
     }
   }
   ```

   **Semgrep report** (`semgrep-report.json`):
   ```json
   {
     "results": [],
     "errors": []
   }
   ```

5. **Document Findings**
   - Note any vulnerabilities found
   - Document severity levels
   - List any code security issues
   - Record remediation steps taken

### Method 2: Manual SAST Scans

If CI/CD pipeline cannot be run, perform manual scans:

#### npm audit

```bash
# Run npm audit
npm audit

# Run with JSON output for documentation
npm audit --json > security-evidence/npm-audit-manual.json
```

**Example Output:**
```
found 0 vulnerabilities
```

Or with vulnerabilities:
```
found 1 low severity vulnerability
Package: express
Severity: low
Vulnerable: <4.18.2
Patched: >=4.18.2
Path: express
```

#### Semgrep

```bash
# Install Semgrep
python3 -m pip install semgrep

# Run Semgrep scan
semgrep --config=auto --json --output=security-evidence/semgrep-manual.json src/
```

**Example Output:**
```json
{
  "results": [],
  "errors": []
}
```

Or with findings:
```json
{
  "results": [
    {
      "check_id": "javascript.express.security.express-unsafe-redirect",
      "path": "src/app.js",
      "start": { "line": 45, "col": 10 },
      "end": { "line": 45, "col": 30 },
      "extra": {
        "message": "Unsafe redirect detected",
        "severity": "WARNING"
      }
    }
  ]
}
```

## Capturing DAST Evidence

### Method 1: From GitHub Actions Artifacts

1. **Run CI/CD Pipeline**
   - Push code to GitHub or create a Pull Request
   - Wait for pipeline to complete
   - The DAST job runs after Docker build

2. **Download DAST Artifacts**
   - Go to GitHub repository → Actions tab
   - Click on the latest workflow run
   - Scroll to "Artifacts" section
   - Download `dast-results` artifact

3. **Extract Artifact**
   ```bash
   # Extract the downloaded zip file
   unzip dast-results.zip -d security-evidence/
   ```

4. **Review DAST Results**

   Open `zap-report.html` in a web browser:
   - Review summary of findings
   - Check for high/medium/low alerts
   - Document any vulnerabilities found
   - Take screenshots for evidence

### Method 2: Manual DAST Scan with OWASP ZAP

If CI/CD pipeline cannot be run, perform manual scan:

#### Install OWASP ZAP

```bash
# Download OWASP ZAP
wget -q https://github.com/zaproxy/zaproxy/releases/download/v2.14.0/ZAP_2.14.0_Linux.tar.gz

# Extract
tar -xzf ZAP_2.14.0_Linux.tar.gz

# Make executable
chmod +x ZAP_2.14.0/zap.sh
```

#### Start Application

```bash
# Start the Calculator API
npm start
```

Or using Docker:
```bash
docker run -p 3000:3000 calculator-api:latest
```

#### Run OWASP ZAP Scan

```bash
# Run baseline scan
./ZAP_2.14.0/zap.sh -cmd -quickurl http://localhost:3000 -quickout security-evidence/zap-manual-report.html -port 8080
```

**Options:**
- `-cmd`: Run in command-line mode
- `-quickurl`: URL to scan
- `-quickout`: Output report file
- `-port`: ZAP proxy port

#### Review Report

Open `security-evidence/zap-manual-report.html` in a web browser:
- Review summary of findings
- Check for high/medium/low alerts
- Document any vulnerabilities found
- Take screenshots for evidence

## Documenting Security Evidence

### Create Security Evidence Document

Create `security-evidence/summary.md`:

```markdown
# Security Scan Evidence

## SAST (Static Application Security Testing)

### npm audit Results

**Date:** [Date]
**Command:** `npm audit`

**Findings:**
- [Document any vulnerabilities found]

**Severity:**
- Info: 0
- Low: 0
- Moderate: 0
- High: 0
- Critical: 0

**Remediation:**
- [List any steps taken to fix vulnerabilities]

### Semgrep Results

**Date:** [Date]
**Command:** `semgrep --config=auto --json src/`

**Findings:**
- [Document any code security issues found]

**Severity:**
- [List severity levels]

**Remediation:**
- [List any steps taken to fix issues]

## DAST (Dynamic Application Security Testing)

### OWASP ZAP Results

**Date:** [Date]
**Target:** http://localhost:3000
**Tool:** OWASP ZAP 2.14

**Summary:**
- High: 0
- Medium: 0
- Low: 0
- Informational: 0

**Findings:**
- [Document any vulnerabilities found]

**Remediation:**
- [List any steps taken to fix vulnerabilities]

## Conclusion

Overall security posture: [Good/Acceptable/Needs Improvement]

All security scans completed with no critical or high vulnerabilities found.
```

## Expected Results for This Project

### SAST Results

**npm audit:**
```
found 0 vulnerabilities
```

**Semgrep:**
```json
{
  "results": [],
  "errors": []
}
```

### DAST Results

**OWASP ZAP:**
- High: 0
- Medium: 0
- Low: 0-2 (informational alerts about HTTP headers, etc.)
- Informational: 1-3

**Common Informational Findings:**
- Missing X-Content-Type-Options header
- Missing Content-Security-Policy header
- Server header disclosure

These are informational and acceptable for this project.

## Troubleshooting

### CI/CD Pipeline Fails

**Issue:** SAST or DAST job fails

**Solutions:**
1. Check GitHub Actions logs for specific error
2. Verify GitHub secrets are configured correctly
3. Ensure application builds and runs successfully
4. Check if OWASP ZAP download URL is accessible

### npm audit Fails

**Issue:** npm audit finds vulnerabilities

**Solutions:**
1. Update dependencies: `npm update`
2. Fix specific vulnerabilities: `npm audit fix`
3. Review and accept if acceptable: `npm audit --audit-level=high`
4. Document findings in security evidence

### Semgrep Fails

**Issue:** Semgrep finds code issues

**Solutions:**
1. Review specific findings in report
2. Fix code issues if critical
3. Add exceptions if false positives
4. Document findings in security evidence

### OWASP ZAP Fails

**Issue:** DAST scan fails to connect

**Solutions:**
1. Ensure application is running on expected port
2. Check firewall settings
3. Verify OWASP ZAP is installed correctly
4. Run manual scan if automated fails

## Security Best Practices Implemented

This project includes the following security measures:

1. **Input Validation**
   - Number parsing with error handling
   - Division by zero check
   - Invalid operation handling

2. **Error Handling**
   - Generic error messages
   - No sensitive information disclosure
   - Proper HTTP status codes

3. **Container Security**
   - Non-root user in Dockerfile
   - Minimal base image (Alpine)
   - Health checks

4. **Dependency Management**
   - Regular npm audit
   - Up-to-date dependencies
   - Security scanning

5. **API Security**
   - No authentication required (simple API)
   - Rate limiting can be added
   - HTTPS can be added

## Next Steps

After capturing security evidence:

1. **Document all findings** in security evidence document
2. **Take screenshots** of reports for presentation
3. **Update final report** with security scan results
4. **Include in presentation** security section
5. **Submit evidence** with project deliverables

---

**Last Updated:** January 15, 2026
**Tools Used:** npm audit, Semgrep, OWASP ZAP 2.14
