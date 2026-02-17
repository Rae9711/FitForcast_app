import request from 'supertest';
import app from '../src/index';

// Smoke test ensures the service signals readiness with a simple JSON payload.
describe('health endpoint', () => {
  it('responds with ok status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});
