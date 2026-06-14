import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecordsController } from './medical-records.controller';
import { MedicalRecord } from '../database/migrations/entities/medical-record.entity';
import { Prescription } from '../database/migrations/entities/prescription.entity';
import { Patient } from '../database/migrations/entities/patient.entity';
import { Doctor } from '../database/migrations/entities/doctor.entity';
import { Appointment } from '../database/migrations/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MedicalRecord, 
      Prescription, 
      Patient, 
      Doctor, 
      Appointment
    ])
  ],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
  exports: [MedicalRecordsService],
})
export class MedicalRecordsModule {}