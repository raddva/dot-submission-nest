import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { Schedule } from '../database/migrations/entities/schedule.entity';
import { Doctor } from '../database/migrations/entities/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Doctor])
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}