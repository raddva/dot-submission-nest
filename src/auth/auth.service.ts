import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../database/migrations/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: any) {
    const { email, password, role } = registerDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar!');
    }

    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = this.userRepository.create({
        email,
        password: hashedPassword,
        role, // 'ADMIN' | 'DOCTOR' | 'PATIENT'
      });

      await this.userRepository.save(newUser);

      return {
        message: 'Registrasi berhasil',
        data: { id: newUser.id, email: newUser.email, role: newUser.role }
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email sudah terdaftar!');
      }
      throw new InternalServerErrorException('Gagal mendaftarkan user baru');
    }
  }

  async login(loginDto: any) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role      
    };

    return {
      message: 'Login berhasil',
      access_token: this.jwtService.sign(payload),
    };
  }
}