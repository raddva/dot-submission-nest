import * as dotenv from 'dotenv';
dotenv.config();

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('AuthController - Full Auth Suite (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const mockUsers = {
    admin: {
      email: 'admin.clinic@clinic.com',
      password: 'AdminPassword123!',
      role: 'ADMIN',
    },
    doctor: {
      email: 'doctor.stranger@clinic.com',
      password: 'DoctorPassword123!',
      role: 'DOCTOR',
    },
    patient: {
      email: 'patient.john@clinic.com',
      password: 'PatientPassword123!',
      role: 'PATIENT',
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.query(`DELETE FROM "users" WHERE email LIKE '%@clinic.com'`);
      await dataSource.destroy();
    }
    await app.close();
  });

  describe('/auth/register (POST) - All Roles', () => {
    it('register user dengan role ADMIN', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockUsers.admin)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Registrasi berhasil');
    });

    it('register user dengan role DOCTOR', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockUsers.doctor)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Registrasi berhasil');
    });

    it('register user dengan role PATIENT', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockUsers.patient)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Registrasi berhasil');
    });

    it('fail jika register email yang sudah terpakai', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockUsers.patient)
        .expect(409); // Conflict
    });

    it('fail jika format email tidak valid', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'bukan-email-valid',
          password: 'Password123',
          role: 'PATIENT',
        })
        .expect(400); // Bad Request
    });

    it('fail jika role tidak terdaftar di ENUM sistem', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'alien@clinic.com',
          password: 'Password123',
          role: 'HACKER_ROLE',
        })
        .expect(400); // Bad Request
    });
  });

  describe('/auth/login (POST) - All Roles', () => {
    it('ADMIN login & JWT token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: mockUsers.admin.email,
          password: mockUsers.admin.password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Login berhasil');
      expect(response.body).toHaveProperty('access_token');
    });

    it('DOCTOR login & JWT token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: mockUsers.doctor.email,
          password: mockUsers.doctor.password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Login berhasil');
      expect(response.body).toHaveProperty('access_token');
    });

    it('PATIENT login & JWT token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: mockUsers.patient.email,
          password: mockUsers.patient.password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Login berhasil');
      expect(response.body).toHaveProperty('access_token');
    });

    it('fail login jika password salah', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: mockUsers.patient.email,
          password: 'wrongPass',
        })
        .expect(401); // Unauthorized
    });

    it('fail login jika email belum terdaftar', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'belum.daftar@clinic.com',
          password: 'Password123',
        })
        .expect(401); // Unauthorized
    });
  });
});