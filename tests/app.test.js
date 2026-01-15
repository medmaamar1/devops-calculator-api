const request = require('supertest');
const app = require('../src/app');

describe('Calculator API', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Welcome to the DevOps Calculator API');
      expect(res.body).toHaveProperty('version', '1.0.0');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /metrics', () => {
    it('should return metrics in Prometheus format', async () => {
      const res = await request(app).get('/metrics');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('http_requests_total');
      expect(res.text).toContain('http_response_time_ms');
    });
  });

  describe('Calculator operations', () => {
    it('should add two numbers', async () => {
      const res = await request(app).get('/add?a=5&b=3');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('result', 8);
      expect(res.body).toHaveProperty('operation', 'add');
      expect(res.body).toHaveProperty('traceId');
    });

    it('should subtract two numbers', async () => {
      const res = await request(app).get('/subtract?a=10&b=4');
      expect(res.statusCode).toBe(200);
      expect(res.body.result).toBe(6);
    });

    it('should multiply two numbers', async () => {
      const res = await request(app).get('/multiply?a=6&b=7');
      expect(res.statusCode).toBe(200);
      expect(res.body.result).toBe(42);
    });

    it('should calculate power of two numbers', async () => {
      const res = await request(app).get('/power?a=2&b=3');
      expect(res.statusCode).toBe(200);
      expect(res.body.result).toBe(8);
      expect(res.body.operation).toBe('power');
    });

    it('should divide two numbers', async () => {
      const res = await request(app).get('/divide?a=20&b=4');
      expect(res.statusCode).toBe(200);
      expect(res.body.result).toBe(5);
    });

    it('should return error for division by zero', async () => {
      const res = await request(app).get('/divide?a=10&b=0');
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Division by zero');
    });

    it('should return error for invalid numbers', async () => {
      const res = await request(app).get('/add?a=abc&b=5');
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid numbers');
    });

    it('should return error for invalid operation', async () => {
      const res = await request(app).get('/power?a=2&b=3');
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid operation');
    });
  });
});
