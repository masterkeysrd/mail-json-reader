import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as data from './data/data.json';
import { AppModule } from '../src/app.module';

describe('MailReaderController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/ (POST)', () => {
    it('should return 400 when no body is provided', () => {
      return request(app.getHttpServer())
        .post('/api/v1/json-from-mail')
        .expect(400);
    });

    it('should return 400 when no source is provided', () => {
      return request(app.getHttpServer())
        .post('/api/v1/json-from-mail')
        .send({ location: './test/data/mail-with-attachment.eml' })
        .expect(400);
    });

    it('should return 400 when no location is provided', () => {
      return request(app.getHttpServer())
        .post('/api/v1/json-from-mail')
        .send({ source: 'local' })
        .expect(400);
    });

    it('should return 400 when source is not local or remote', () => {
      return request(app.getHttpServer())
        .post('/api/v1/json-from-mail')
        .send({
          source: 'invalid',
          location: './test/data/mail-with-attachment.eml',
        })
        .expect(400);
    });

    it('should return 400 when location is not a string', () => {
      return request(app.getHttpServer())
        .post('/api/v1/json-from-mail')
        .send({ source: 'local', location: 123 })
        .expect(400);
    });

    it('should return 404 when file does not exist', () => {
      return request(app.getHttpServer())
        .post('/api/v1/json-from-mail')
        .send({ source: 'local', location: './test/data/Invalid.eml' })
        .expect(404);
    });

    it('should return 500 when file is not a valid email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/json-from-mail')
        .send({ source: 'local', location: './test/data/Invalid.eml' })
        .expect(404);
    });

    it('should return status 200 when file is valid', () => {
      return request(app.getHttpServer())
        .post('/api/v1/json-from-mail')
        .send({
          source: 'local',
          location: './test/data/mail-with-attachment.eml',
        })
        .expect(200);
    });

    it('should return the attachment with content type application/json', () => {
      return request(app.getHttpServer())
        .post('/api/v1/json-from-mail')
        .send({
          source: 'local',
          location: './test/data/mail-with-attachment.eml',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(data);
        });
    });
  });
});
