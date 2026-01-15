# Observability Evidence

This document captures evidence of observability features implemented in the DevOps Calculator API project.

## 1. Structured Logging

### Log Format

All logs are structured in JSON format with the following fields:
- `timestamp`: ISO 8601 timestamp
- `level`: Log level (info, error)
- `message`: Log message
- Additional context (method, path, traceId, statusCode, responseTime, error)

### Example Logs

#### Incoming Request Log
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

#### Request Completed Log
```json
{
  "timestamp": "2026-01-15T17:59:01.445Z",
  "level": "info",
  "message": "Request completed",
  "path": "/health",
  "statusCode": 200,
  "traceId": "8ca9413b-a366-4246-9209-ff251b8001fd",
  "responseTime": 9
}
```

#### Error Log
```json
{
  "timestamp": "2026-01-15T17:59:47.283Z",
  "level": "error",
  "message": "Calculation error",
  "error": "Invalid numbers",
  "traceId": "fe0a86f2-1908-4def-99af-7475498a508c"
}
```

### Benefits

- **Machine-readable**: JSON format for easy parsing and analysis
- **Consistent structure**: All logs follow the same format
- **Traceability**: TraceId correlation across request lifecycle
- **Context-rich**: Includes all relevant information for debugging

## 2. Metrics

### Metrics Endpoint

Accessed at `http://localhost:3001/metrics`

### Metrics Output

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

### Metrics Collected

| Metric | Type | Description |
|--------|-------|-------------|
| `http_requests_total` | Counter | Total number of requests per endpoint |
| `http_response_time_ms` | Gauge | Average response time per endpoint in milliseconds |

### Prometheus Format

Metrics are exposed in Prometheus format for easy integration with monitoring systems:
- `# HELP`: Documentation for the metric
- `# TYPE`: Metric type (counter, gauge)
- Metric lines with labels and values

### Benefits

- **Standard format**: Prometheus-compatible for easy integration
- **Real-time monitoring**: Current request counts and response times
- **Per-endpoint metrics**: Granular visibility into each API endpoint
- **Extensible**: Easy to add more metrics

## 3. Request Tracing

### Trace ID Generation

Each request is assigned a unique trace ID using UUID v4.

### Example Trace ID in Response

```json
{
  "operation": "add",
  "a": 5,
  "b": 3,
  "result": 8,
  "traceId": "19153557-0e02-46b0-a964-008e93cf18db"
}
```

### Trace ID in Logs

The same trace ID appears in all logs for a request:

```json
{
  "timestamp": "2026-01-15T18:00:25.120Z",
  "level": "info",
  "message": "Incoming request",
  "method": "GET",
  "path": "/add",
  "traceId": "19153557-0e02-46b0-a964-008e93cf18db"
}
```

```json
{
  "timestamp": "2026-01-15T18:00:25.122Z",
  "level": "info",
  "message": "Request completed",
  "path": "/add",
  "statusCode": 200,
  "traceId": "19153557-0e02-46b0-a964-008e93cf18db",
  "responseTime": 2
}
```

### Tracing Flow

1. Request arrives → Generate traceId (UUID v4)
2. Log incoming request with traceId
3. Process request
4. Log request completion with traceId
5. Return response with traceId

### Benefits

- **End-to-end tracking**: Follow a request through the entire lifecycle
- **Debugging**: Correlate logs for a specific request
- **Performance analysis**: Measure response time per request
- **Error tracking**: Trace errors back to specific requests

## 4. Test Results

### Unit Test Coverage

```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |   93.75 |       90 |   81.81 |   93.54 |                   
 app.js   |   93.75 |       90 |   81.81 |   93.54 | 81-82,86-87       
----------|---------|----------|---------|---------|-------------------
```

### Test Suite Results

```
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

## 5. API Endpoints Tested

### Health Check
```bash
curl http://localhost:3001/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-15T17:59:01.437Z"
}
```

### Add Operation
```bash
curl "http://localhost:3001/add?a=5&b=3"
```

**Response:**
```json
{
  "operation": "add",
  "a": 5,
  "b": 3,
  "result": 8,
  "traceId": "19153557-0e02-46b0-a964-008e93cf18db"
}
```

### Metrics
```bash
curl http://localhost:3001/metrics
```

**Response:** Prometheus-formatted metrics (see above)

## 6. Implementation Details

### Code Location

- **Main Application**: [`src/app.js`](../src/app.js:1)
- **Middleware**: Lines 15-29
- **Metrics Endpoint**: Lines 37-51
- **Logging Function**: Lines 10-13

### Dependencies

- **express**: Web framework
- **uuid**: UUID v4 generation for trace IDs

### No External Observability Dependencies

All observability features are implemented without external dependencies:
- Custom in-memory metrics storage
- Simple JSON logging to console
- UUID for tracing instead of distributed tracing systems

## 7. Summary

### Observability Features Implemented

✅ **Structured Logging**: JSON format with timestamps, levels, and context
✅ **Metrics**: Prometheus-formatted endpoint with request counts and response times
✅ **Request Tracing**: UUID v4 trace IDs for end-to-end tracking
✅ **Test Coverage**: 93.75% statement coverage

### Evidence Collected

- Sample logs showing structured JSON format
- Metrics output in Prometheus format
- Trace IDs in responses and logs
- Test coverage report
- API endpoint responses

### Benefits Achieved

- **Debugging**: Easy to trace issues through logs
- **Monitoring**: Real-time visibility into API performance
- **Troubleshooting**: Trace IDs for request correlation
- **Performance**: Response time tracking per endpoint
- **Extensibility**: Easy to add more observability features

---

**Date Captured:** January 15, 2026
**Application Version:** 1.0.0
**Node.js Version:** 20.17.0
**Test Framework:** Jest 29.7.0
