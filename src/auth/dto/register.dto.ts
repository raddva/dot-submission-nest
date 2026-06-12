import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole } from '../../database/migrations/entities/user.entity';

export class RegisterDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;

  @MinLength(6, { message: 'Password minimal 6 karakter' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  password: string;

  @IsEnum(UserRole, { message: 'Role tidak valid' })
  @IsNotEmpty({ message: 'Role tidak boleh kosong' })
  role: UserRole;
}