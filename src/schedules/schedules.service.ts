import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../database/migrations/entities/schedule.entity';
import { Doctor } from '../database/migrations/entities/doctor.entity';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const doctor = await this.doctorRepository.findOne({ where: { id: createScheduleDto.doctorId } });
    if (!doctor) {
      throw new NotFoundException(`Dokter dengan ID ${createScheduleDto.doctorId} tidak ditemukan`);
    }

    const newSchedule = this.scheduleRepository.create({
      doctor: { id: createScheduleDto.doctorId },
      dayOfWeek: createScheduleDto.dayOfWeek,
      startTime: createScheduleDto.startTime,
      endTime: createScheduleDto.endTime,
    });

    return await this.scheduleRepository.save(newSchedule);
  }

  async findByDoctor(doctorId: string): Promise<Schedule[]> {
    const schedules = await this.scheduleRepository.find({
      where: { 
        doctor: { id: doctorId },
        isActive: true,
      },
      order: {
        dayOfWeek: 'ASC',
        startTime: 'ASC',
      },
    });

    if (!schedules || schedules.length === 0) {
      throw new NotFoundException(`Tidak ada jadwal aktif untuk dokter dengan ID ${doctorId}`);
    }

    return schedules;
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Jadwal dengan ID ${id} tidak ditemukan`);
    }
    return schedule;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findOne(id);
    const updatedSchedule = this.scheduleRepository.merge(schedule, updateScheduleDto);
    return await this.scheduleRepository.save(updatedSchedule);
  }

  async remove(id: string): Promise<{ message: string }> {
    const schedule = await this.findOne(id);
    await this.scheduleRepository.remove(schedule);
    return { message: `Jadwal dengan ID ${id} berhasil dihapus` };
  }
}