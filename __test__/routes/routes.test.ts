import request from 'supertest';
import app from '../../src/index';

describe('Service Endpoint Tests', () => {
  it('should be /register endpoint working', async () => {
    const body = {
      apiName: 'test',
      protocol: 'http',
      host: 'localhost',
      port: process.env.PORT,
      enabled: true,
    };

    const response = await request(app).post('/register').send(body);
    expect(response.status).toBe(201 || 200);
  });

  it('should be service stop with /enable/apiName', async () => {
    const body = { apiName: 'test', enabled: false, url: `http://localhost:${process.env.PORT}/` };
    const response = await request(app).post('/enable/test').send(body);
    expect(response.status).toBe(200);
  });

  it('should be service start with /enable/apiName', async () => {
    const body = { apiName: 'test', enabled: true, url: `http://localhost:${process.env.PORT}/` };
    const response = await request(app).post('/enable/test').send(body);
    expect(response.status).toBe(200);
  });

  it('should be /unregister instance array endpoint working', async () => {
    const body = { apiName: 'test', url: `http://localhost:${process.env.PORT}/` };
    const response = await request(app).post('/unregister').send(body);
    expect(response.status).toBe(200);
  });
});

describe('Redirect Endpoint Tests', () => {
  describe('should be contact from rest server and return back data from rest server', () => {
    it('should be /entegration/getFilter endpoint working', async () => {
      const response = await request(app).post('/entegration/getFilter');
      expect(response.status).toBe(200);
    });
  });
});
