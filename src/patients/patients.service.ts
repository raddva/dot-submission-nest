import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../database/migrations/entities/patient.entity';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async findAll(): Promise<Patient[]> {
    return await this.patientRepository.find({
      relations: { user: true },
      select: {
        user: { id: true, email: true, role: true },
      },
    });
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: { user: true, medicalRecords: true, appointments: true },
      select: {
        user: { id: true, email: true },
      },
    });

    if (!patient) {
      throw new NotFoundException(`Pasien dengan ID ${id} tidak ditemukan`);
    }
    return patient;
  }

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      const newPatient = this.patientRepository.create({
        user: { id: createPatientDto.userId },
        name: createPatientDto.name,
        dateOfBirth: createPatientDto.dateOfBirth as any, 
        phone: createPatientDto.phone,
        address: createPatientDto.address,
      });

      return await this.patientRepository.save(newPatient);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User ini sudah memiliki profil pasien');
      }
      throw new InternalServerErrorException('Gagal membuat profil pasien');
    }
  }

  async getMyProfile(userId: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
      select: { user: { email: true, role: true } },
    });

    if (!patient) {
      throw new NotFoundException('Profil pasien untuk akun ini belum dibuat');
    }
    return patient;
  }

  async updateProfile(userId: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.getMyProfile(userId);

    const updatedPatient = this.patientRepository.merge(patient, updatePatientDto as any);
    return await this.patientRepository.save(updatedPatient);
  }

  async remove(id: string): Promise<{ message: string }> {
    const patient = await this.findOne(id);
    await this.patientRepository.remove(patient);
    return { message: `Profil pasien dengan ID ${id} berhasil dihapus` };
  }
}