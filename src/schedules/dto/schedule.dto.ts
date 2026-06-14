import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsUUID, Matches, Max, Min } from 'class-validator';

export class CreateScheduleDto {
  @IsUUID('4', { message: 'Doctor ID harus berupa UUID yang valid' })
  @IsNotEmpty({ message: 'Doctor ID tidak boleh kosong' })
  doctorId: string;

  @IsInt({ message: 'Hari harus berupa angka' })
  @Min(0, { message: 'Hari minimal 0 (Minggu)' })
  @Max(6, { message: 'Hari maksimal 6 (Sabtu)' })
  @IsNotEmpty({ message: 'Hari tidak boleh kosong' })
  dayOfWeek: number;

  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Format waktu mulai harus HH:mm (contoh: 08:00)' })
  @IsNotEmpty({ message: 'Waktu mulai tidak boleh kosong' })
  startTime: string;

  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Format waktu selesai harus HH:mm (contoh: 15:30)' })
  @IsNotEmpty({ message: 'Waktu selesai tidak boleh kosong' })
  endTime: string;
}

export class UpdateScheduleDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Format waktu mulai harus HH:mm' })
  startTime?: string;

  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Format waktu selesai harus HH:mm' })
  endTime?: string;

  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus bernilai true/false' })
  isActive?: boolean;
}