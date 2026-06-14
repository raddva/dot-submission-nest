import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../database/migrations/entities/doctor.entity';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async findAll(): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      relations: { user: true },
      select: {
        user: { id: true, email: true, role: true },
      },
    });
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: { user: true, schedules: true },
      select: {
        user: { id: true, email: true },
      },
    });

    if (!doctor) {
      throw new NotFoundException(`Dokter dengan ID ${id} tidak ditemukan`);
    }
    return doctor;
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    try {
      const newDoctor = this.doctorRepository.create({
        user: { id: createDoctorDto.userId },
        name: createDoctorDto.name,
        specialization: createDoctorDto.specialization,
        phone: createDoctorDto.phone,
      });

      return await this.doctorRepository.save(newDoctor);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User ini sudah memiliki profil dokter');
      }
      throw new InternalServerErrorException('Gagal membuat profil dokter');
    }
  }

  async updateProfile(userId: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!doctor) {
      throw new NotFoundException('Profil dokter untuk akun ini belum dibuat oleh Admin');
    }

    const updatedDoctor = this.doctorRepository.merge(doctor, updateDoctorDto);
    return await this.doctorRepository.save(updatedDoctor);
  }

  async remove(id: string): Promise<{ message: string }> {
    const doctor = await this.findOne(id);
    await this.doctorRepository.remove(doctor);
    return { message: `Profil dokter dengan ID ${id} berhasil dihapus` };
  }
}