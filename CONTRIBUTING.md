# Contributing to DevOps Calculator API

Thank you for your interest in contributing to this DevOps project! This document provides guidelines for contributing, especially for peer reviews as part of the course requirements.

## How to Contribute

### For Course Participants (Peer Reviews)

This project is designed for DevOps course assignments. If you are reviewing this project as part of a peer review exchange, please follow these guidelines:

### Peer Review Process

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd devops-calculator-api
   ```

2. **Review the Code**
   - Read through the main application code in [`src/app.js`](src/app.js:1)
   - Review the test suite in [`tests/app.test.js`](tests/app.test.js:1)
   - Check the CI/CD pipeline in [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml:1)
   - Review Kubernetes manifests in the [`k8s/`](k8s/deployment.yaml:1) directory

3. **Test the Application**
   ```bash
   npm install
   npm test
   npm start
   ```
   Then test the API endpoints:
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3000/add?a=5&b=3
   curl http://localhost:3000/metrics
   ```

4. **Provide Constructive Feedback**
   - Focus on code quality, best practices, and DevOps principles
   - Be specific about what works well and what could be improved
   - Suggest practical improvements when applicable
   - Be respectful and constructive in your comments

### Peer Review Checklist

Use this checklist when reviewing the project:

#### Code Quality
- [ ] Code is readable and well-structured
- [ ] Appropriate error handling is implemented
- [ ] Code follows JavaScript best practices
- [ ] Comments are clear and helpful where needed

#### Functionality
- [ ] All API endpoints work correctly
- [ ] Input validation is implemented
- [ ] Error responses are appropriate
- [ ] Health check endpoint is functional

#### Testing
- [ ] Unit tests cover all endpoints
- [ ] Tests include edge cases
- [ ] Tests pass successfully
- [ ] Test coverage is adequate

#### Observability
- [ ] Structured logging is implemented
- [ ] Metrics endpoint is available
- [ ] Request tracing is implemented
- [ ] Logs include relevant information

#### Security
- [ ] Input validation prevents injection attacks
- [ ] Error messages don't expose sensitive information
- [ ] Security scans are configured in CI/CD
- [ ] Dependencies are up to date

#### DevOps Practices
- [ ] CI/CD pipeline is properly configured
- [ ] Dockerfile follows best practices
- [ ] Kubernetes manifests are correct
- [ ] Documentation is comprehensive

### Providing Feedback

When providing feedback, please:

1. **Start with Positive Feedback**
   - Mention what you liked about the project
   - Highlight well-implemented features
   - Acknowledge good practices

2. **Be Specific**
   - Reference specific files and line numbers
   - Provide examples of what you mean
   - Suggest concrete improvements

3. **Be Constructive**
   - Focus on how to improve, not just what's wrong
   - Provide actionable suggestions
   - Explain why a change would be beneficial

4. **Be Respectful**
   - Use professional language
   - Acknowledge different approaches
   - Be open to discussion

### Example Peer Review Comments

**Good Example:**
```
Great job on implementing the Calculator API! I particularly liked:

1. The clean code structure in src/app.js - it's easy to follow
2. The comprehensive test coverage - all endpoints are tested
3. The observability features - metrics and logging are well implemented

A few suggestions for improvement:

1. Line 45 in src/app.js: Consider adding more detailed error messages
   to help with debugging. For example, instead of just "Invalid numbers",
   you could specify which parameter is invalid.

2. The Kubernetes deployment.yaml could benefit from adding resource
   limits for better resource management. The current setup has requests
   but no limits.

3. Consider adding a rate limiting middleware to prevent abuse of the API.
   This would be a good security enhancement.

Overall, excellent work on this DevOps project!
```

**Poor Example:**
```
The code is bad. You should fix it.
```

### Opening Pull Requests

If you're contributing code changes:

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, well-documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: brief description of your changes"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub with:
   - Clear title and description
   - Testing instructions
   - Related issues (if any)

### Code Style Guidelines

- Use 2 spaces for indentation
- Use camelCase for variables and functions
- Use PascalCase for classes and constructors
- Add JSDoc comments for functions
- Keep functions small and focused
- Follow JavaScript best practices

### Testing Guidelines

- Write tests for all new features
- Aim for high test coverage (80%+)
- Test both happy paths and edge cases
- Use descriptive test names
- Keep tests independent and fast

## Questions?

If you have questions about contributing or reviewing this project, please:

1. Check the [README.md](README.md:1) for project information
2. Review the [project plan](plans/devops-project-plan.md:1) for architecture details
3. Open an issue on GitHub for questions or discussions

## Thank You!

Thank you for contributing to this DevOps project and for providing valuable peer reviews. Your feedback helps improve the project and helps everyone learn DevOps best practices!
