import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDoctorDto {
  @IsUUID('4', { message: 'User ID harus berupa UUID yang valid' })
  @IsNotEmpty({ message: 'User ID tidak boleh kosong' })
  userId: string;

  @IsString({ message: 'Nama harus berupa teks' })
  @IsNotEmpty({ message: 'Nama dokter tidak boleh kosong' })
  name: string;

  @IsString({ message: 'Spesialisasi harus berupa teks' })
  @IsNotEmpty({ message: 'Spesialisasi tidak boleh kosong' })
  specialization: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateDoctorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}