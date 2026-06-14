import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';

@Controller('doctors')
@UseGuards(AuthGuard('jwt'))
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  async findAll() {
    return this.doctorsService.findAll();
  }

  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateDoctorDto: UpdateDoctorDto) {
    const userId = req.user.userId; 
    return this.doctorsService.updateProfile(userId, updateDoctorDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }
}