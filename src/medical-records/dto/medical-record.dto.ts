import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePrescriptionDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama obat tidak boleh kosong' })
  medicationName: string;

  @IsString()
  @IsNotEmpty({ message: 'Dosis tidak boleh kosong' })
  dosage: string;

  @IsString()
  @IsNotEmpty({ message: 'Instruksi penggunaan tidak boleh kosong' })
  instructions: string;
}

export class CreateMedicalRecordDto {
  @IsUUID('4', { message: 'Patient ID harus berupa UUID' })
  @IsNotEmpty({ message: 'Patient ID tidak boleh kosong' })
  patientId: string;

  @IsUUID('4', { message: 'Doctor ID harus berupa UUID' })
  @IsNotEmpty({ message: 'Doctor ID tidak boleh kosong' })
  doctorId: string;

  @IsOptional()
  @IsUUID('4', { message: 'Appointment ID harus berupa UUID' })
  appointmentId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Diagnosa tidak boleh kosong' })
  diagnosis: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionDto)
  prescriptions?: CreatePrescriptionDto[];
}