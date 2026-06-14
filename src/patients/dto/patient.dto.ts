import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePatientDto {
  @IsUUID('4', { message: 'User ID harus berupa UUID yang valid' })
  @IsNotEmpty({ message: 'User ID tidak boleh kosong' })
  userId: string;

  @IsString({ message: 'Nama harus berupa teks' })
  @IsNotEmpty({ message: 'Nama pasien tidak boleh kosong' })
  name: string;

  @IsDateString({}, { message: 'Format tanggal lahir tidak valid (Gunakan YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Tanggal lahir tidak boleh kosong' })
  dateOfBirth: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal lahir tidak valid (Gunakan YYYY-MM-DD)' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}