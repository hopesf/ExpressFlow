import request from 'supertest';
import app from '../../src/index';

describe('Redirect Endpoint Tests', () => {
  describe('should be contact from rest server and return back data from rest server', () => {
    it('should be /entegration/getFilter endpoint working', async () => {
      const response = await request(app).post('/entegration/getFilter');
      expect(response.status).toBe(400);
    });
  });
});
