import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from '../database/migrations/entities/medical-record.entity';
import { Prescription } from '../database/migrations/entities/prescription.entity';
import { Patient } from '../database/migrations/entities/patient.entity';
import { Doctor } from '../database/migrations/entities/doctor.entity';
import { Appointment, AppointmentStatus } from '../database/migrations/entities/appointment.entity';
import { CreateMedicalRecordDto } from './dto/medical-record.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createDto: CreateMedicalRecordDto): Promise<MedicalRecord> {
    const patient = await this.patientRepository.findOne({ where: { id: createDto.patientId } });
    if (!patient) throw new NotFoundException('Data pasien tidak ditemukan');

    const doctor = await this.doctorRepository.findOne({ where: { id: createDto.doctorId } });
    if (!doctor) throw new NotFoundException('Data dokter tidak ditemukan');

    if (createDto.appointmentId) {
      const appointment = await this.appointmentRepository.findOne({ where: { id: createDto.appointmentId } });
      if (!appointment) throw new NotFoundException('Janji temu tidak ditemukan');
      
      appointment.status = AppointmentStatus.COMPLETED;
      await this.appointmentRepository.save(appointment);
    }

    const newRecord = this.medicalRecordRepository.create({
      patient: { id: createDto.patientId },
      doctor: { id: createDto.doctorId },
      appointment: createDto.appointmentId ? { id: createDto.appointmentId } : undefined,
      diagnosis: createDto.diagnosis,
      notes: createDto.notes,
    });
    
    const savedRecord = await this.medicalRecordRepository.save(newRecord);

    if (createDto.prescriptions && createDto.prescriptions.length > 0) {
      const prescriptionsToSave = createDto.prescriptions.map(p => {
        return this.prescriptionRepository.create({
          medicalRecord: { id: savedRecord.id },
          medicationName: p.medicationName,
          dosage: p.dosage,
          instructions: p.instructions,
        });
      });
      await this.prescriptionRepository.save(prescriptionsToSave);
    }

    return this.findOne(savedRecord.id);
  }

  async findOne(id: string): Promise<MedicalRecord> {
    const record = await this.medicalRecordRepository.findOne({
      where: { id },
      relations: { patient: true, doctor: true, prescriptions: true },
      select: {
        patient: { id: true, name: true, dateOfBirth: true },
        doctor: { id: true, name: true, specialization: true },
      }
    });

    if (!record) throw new NotFoundException(`Rekam medis dengan ID ${id} tidak ditemukan`);
    return record;
  }

  async findMyMedicalRecords(userId: string): Promise<MedicalRecord[]> {
    const patient = await this.patientRepository.findOne({ where: { user: { id: userId } } });
    if (!patient) throw new NotFoundException('Profil pasien belum dibuat');

    return await this.medicalRecordRepository.find({
      where: { patient: { id: patient.id } },
      relations: { doctor: true, prescriptions: true },
      order: { createdAt: 'DESC' },
      select: {
        doctor: { name: true, specialization: true }
      }
    });
  }

  async findByPatientId(patientId: string): Promise<MedicalRecord[]> {
    return await this.medicalRecordRepository.find({
      where: { patient: { id: patientId } },
      relations: { doctor: true, prescriptions: true },
      order: { createdAt: 'DESC' }
    });
  }
}