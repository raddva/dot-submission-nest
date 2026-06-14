import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../database/migrations/entities/appointment.entity';
import { Patient } from '../database/migrations/entities/patient.entity';
import { Schedule } from '../database/migrations/entities/schedule.entity';
import { Doctor } from '../database/migrations/entities/doctor.entity';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto/appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const { patientId, scheduleId, appointmentDate } = createAppointmentDto;
    const patient = await this.patientRepository.findOne({ where: { id: patientId } });
    if (!patient) throw new NotFoundException('Data pasien tidak ditemukan');

    const schedule = await this.scheduleRepository.findOne({ 
      where: { id: scheduleId },
      relations: { doctor: true } 
    });
    if (!schedule) throw new NotFoundException('Jadwal praktek tidak ditemukan');
    if (!schedule.isActive) throw new BadRequestException('Jadwal praktek ini sedang tidak aktif');

    const requestedDate = new Date(appointmentDate);
    const dayOfWeekRequested = requestedDate.getDay();

    if (dayOfWeekRequested !== schedule.dayOfWeek) {
      throw new BadRequestException(
        `Tanggal yang dipilih tidak sesuai dengan hari praktek dokter. Dokter ini praktek pada hari ke-${schedule.dayOfWeek} (0=Minggu, 6=Sabtu)`
      );
    }

    const newAppointment = this.appointmentRepository.create({
      patient: { id: patientId },
      schedule: { id: scheduleId },
      appointmentDate: appointmentDate as any,
    });

    return await this.appointmentRepository.save(newAppointment);
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      relations: { patient: true, schedule: { doctor: true } },
      order: { appointmentDate: 'DESC' },
    });
  }

  async findMyPatientAppointments(userId: string): Promise<Appointment[]> {
    const patient = await this.patientRepository.findOne({ where: { user: { id: userId } } });
    if (!patient) throw new NotFoundException('Profil pasien belum dibuat');

    return await this.appointmentRepository.find({
      where: { patient: { id: patient.id } },
      relations: { schedule: { doctor: true } },
      order: { appointmentDate: 'DESC' },
    });
  }

  async findMyDoctorAppointments(userId: string): Promise<Appointment[]> {
    const doctor = await this.doctorRepository.findOne({ where: { user: { id: userId } } });
    if (!doctor) throw new NotFoundException('Profil dokter belum dibuat');

    return await this.appointmentRepository.find({
      where: { schedule: { doctor: { id: doctor.id } } },
      relations: { patient: true, schedule: true },
      order: { appointmentDate: 'ASC' },
    });
  }

  async updateStatus(id: string, updateStatusDto: UpdateAppointmentStatusDto): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException(`Janji temu dengan ID ${id} tidak ditemukan`);

    appointment.status = updateStatusDto.status;
    return await this.appointmentRepository.save(appointment);
  }
}