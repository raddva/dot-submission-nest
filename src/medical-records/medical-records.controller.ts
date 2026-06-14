import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/medical-record.dto';

@Controller('medical-records')
@UseGuards(AuthGuard('jwt'))
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  async create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(createMedicalRecordDto);
  }

  @Get('my-records')
  async findMyMedicalRecords(@Req() req: any) {
    const userId = req.user.userId;
    return this.medicalRecordsService.findMyMedicalRecords(userId);
  }

  @Get('patient/:patientId')
  async findByPatientId(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.findByPatientId(patientId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.medicalRecordsService.findOne(id);
  }
}