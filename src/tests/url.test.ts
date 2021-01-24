import request from 'supertest';
import app from '../app';
import { prisma } from '../db/dbService';

let hash = '';

describe('POST / create short url', () => {
  it('should create new short url', async () => {
    const result = await request(app)
      .post('/')
      .send({ url: 'https://google.com' })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(result.body).toBeDefined();
    expect(result.body.success).toBe(true);
    expect(result.body.data).toBeDefined();
    // eslint-disable-next-line prefer-destructuring
    hash = result.body.data.split('/')[3];
  });
  it('should validation error on missing url', async () => {
    const result = await request(app)
      .post('/')
      .send({ })
      .expect(422)
      .expect('Content-Type', /json/);
    expect(result.body.details['body.url'].message).toBe("'url' is required");
  });
});

describe('GET /hash get unshortened url', () => {
  it('should get the unshortened url', async () => {
    const result = await request(app)
      .get(`/${hash}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(result.body).toBeDefined();
    expect(result.body.success).toBe(true);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.url).toBe('https://google.com');
  });

  it('should return not found if no hash provided', async () => {
    const result = await request(app)
      .get('/')
      .expect(404)
      .expect('Content-Type', /json/);
    expect(result.body).toBeDefined();
    expect(result.body.message).toBe('Not Found');
  });

  it('should return not found if wrong hash provided', async () => {
    const result = await request(app)
      .get('/abcdef')
      .expect(404)
      .expect('Content-Type', /json/);
    expect(result.body).toBeDefined();
    expect(result.body.success).toBe(false);
    expect(result.body.error).toBe('No url with provided hash found');
  });
});

afterAll(async () => {
  await prisma.$queryRaw`DELETE FROM Url WHERE hash=${hash}`;
});
