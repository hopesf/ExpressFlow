import request from 'supertest';
import app from '../../src/index';

describe('Swagger Endpoints Tests', () => {
  it('should be /docs endpoint working', async () => {
    const response = await request(app).get('/docs');
    expect(response.status).toBe(301);
  });

  it('should be /docs.json endpoint working', async () => {
    const response = await request(app).get('/docs.json');
    expect(response.status).toBe(200);
    expect(response.type).toEqual('application/json');
  });
});
