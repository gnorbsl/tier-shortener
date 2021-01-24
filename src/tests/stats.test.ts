import request from 'supertest';
import { createHash } from 'crypto';
import app from '../app';
import { DBStats, DBUrl, prisma } from '../db/dbService';

beforeAll(async () => {
  await prisma.$queryRaw("DELETE FROM Url WHERE hash='123456'");
});

describe('GET /stats get statistics for url', () => {
  it('should return statistics for valid hash', async () => {
    const dummyUrl = await DBUrl.create({
      data: {
        url: 'https://google.com',
        hash: '123456',
      },
    });

    await DBStats.create({
      data: {
        ipHash: createHash('md5').update('127.0.0.1').digest('hex'),
        urlId: dummyUrl.id,
      },
    });
    const result = await request(app)
      .get(`/stats/${dummyUrl.hash}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(result.body).toBeDefined();
    expect(result.body.success).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.totalVisits).toBeDefined();
    expect(result.body.data.uniqueVisits).toBeDefined();
  });

  it('should return not found if no hash is provided', async () => {
    const result = await request(app)
      .get('/stats/')
      .expect(404)
      .expect('Content-Type', /json/);
    expect(result.body).toBeDefined();
    expect(result.body.success).toBe(false);
    expect(result.body.error).toBe('No url with provided hash found');
  });

  it('should return url not found if wrong hash is provided', async () => {
    const result = await request(app)
      .get('/stats/abcdef')
      .expect(404)
      .expect('Content-Type', /json/);
    expect(result.body).toBeDefined();
    expect(result.body.success).toBe(false);
    expect(result.body.error).toBe('No url with provided hash found');
  });
});
