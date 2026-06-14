import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from '../database/migrations/entities/appointment.entity';
import { Patient } from '../database/migrations/entities/patient.entity';
import { Schedule } from '../database/migrations/entities/schedule.entity';
import { Doctor } from '../database/migrations/entities/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Patient, Schedule, Doctor])
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}