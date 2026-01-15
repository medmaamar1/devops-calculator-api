const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const metrics = { requests: {}, responseTimes: {} };
const log = (level, message, data = {}) => {
  const logEntry = { timestamp: new Date().toISOString(), level, message, ...data };
  console.log(JSON.stringify(logEntry));
};

const middleware = (req, res, next) => {
  const traceId = uuidv4();
  const startTime = Date.now();
  req.traceId = traceId;
  log('info', 'Incoming request', { method: req.method, path: req.path, traceId });

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const path = req.path;
    metrics.requests[path] = (metrics.requests[path] || 0) + 1;
    metrics.responseTimes[path] = (metrics.responseTimes[path] || 0) + responseTime;
    log('info', 'Request completed', { path, statusCode: res.statusCode, traceId, responseTime });
  });
  next();
};

app.use(middleware);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the DevOps Calculator API', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/metrics', (req, res) => {
  let output = '# HELP http_requests_total Total number of requests\n';
  output += '# TYPE http_requests_total counter\n';
  Object.entries(metrics.requests).forEach(([path, count]) => {
    output += `http_requests_total{path="${path}"} ${count}\n`;
  });
  output += '# HELP http_response_time_ms Response time in milliseconds\n';
  output += '# TYPE http_response_time_ms gauge\n';
  Object.entries(metrics.responseTimes).forEach(([path, time]) => {
    const avgTime = time / metrics.requests[path];
    output += `http_response_time_ms{path="${path}"} ${avgTime.toFixed(2)}\n`;
  });
  res.set('Content-Type', 'text/plain');
  res.send(output);
});

const calculate = (op, a, b) => {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  if (isNaN(numA) || isNaN(numB)) throw new Error('Invalid numbers');
  switch (op) {
    case 'add': return numA + numB;
    case 'subtract': return numA - numB;
    case 'multiply': return numA * numB;
    case 'divide':
      if (numB === 0) throw new Error('Division by zero');
      return numA / numB;
    case 'power': return Math.pow(numA, numB);
    default: throw new Error('Invalid operation');
  }
};

app.get('/:op', (req, res) => {
  try {
    const { op } = req.params;
    const { a, b } = req.query;
    const result = calculate(op, a, b);
    res.json({ operation: op, a: parseFloat(a), b: parseFloat(b), result, traceId: req.traceId });
  } catch (error) {
    log('error', 'Calculation error', { error: error.message, traceId: req.traceId });
    res.status(400).json({ error: error.message, traceId: req.traceId });
  }
});

app.use((err, req, res, next) => {
  log('error', 'Unhandled error', { error: err.message, traceId: req.traceId });
  res.status(500).json({ error: 'Internal server error', traceId: req.traceId });
});

if (require.main === module) {
  app.listen(PORT, () => {
    log('info', `Calculator API running on port ${PORT}`);
  });
}

module.exports = app;
