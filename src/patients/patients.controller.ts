import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';

@Controller('patients')
@UseGuards(AuthGuard('jwt'))
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  async findAll() {
    return this.patientsService.findAll();
  }

  @Get('my-profile')
  async getMyProfile(@Req() req: any) {
    const userId = req.user.userId;
    return this.patientsService.getMyProfile(userId);
  }

  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updatePatientDto: UpdatePatientDto) {
    const userId = req.user.userId;
    return this.patientsService.updateProfile(userId, updatePatientDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }
}