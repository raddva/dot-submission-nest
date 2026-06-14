import { IsDateString, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { AppointmentStatus } from '../../database/migrations/entities/appointment.entity';

export class CreateAppointmentDto {
  @IsUUID('4', { message: 'Patient ID harus berupa UUID' })
  @IsNotEmpty({ message: 'Patient ID tidak boleh kosong' })
  patientId: string;

  @IsUUID('4', { message: 'Schedule ID harus berupa UUID' })
  @IsNotEmpty({ message: 'Schedule ID tidak boleh kosong' })
  scheduleId: string;

  @IsDateString({}, { message: 'Format tanggal tidak valid (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Tanggal janji temu tidak boleh kosong' })
  appointmentDate: string;
}

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus, { message: 'Status tidak valid' })
  @IsNotEmpty({ message: 'Status tidak boleh kosong' })
  status: AppointmentStatus;
}