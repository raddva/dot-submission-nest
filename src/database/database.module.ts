import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './migrations/entities/user.entity';
import { Doctor } from './migrations/entities/doctor.entity';
import { Patient } from './migrations/entities/patient.entity';
import { Schedule } from './migrations/entities/schedule.entity';
import { Appointment } from './migrations/entities/appointment.entity';
import { MedicalRecord } from './migrations/entities/medical-record.entity';
import { Prescription } from './migrations/entities/prescription.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD') || '', 
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Doctor, Patient, Schedule, Appointment, MedicalRecord, Prescription],
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}