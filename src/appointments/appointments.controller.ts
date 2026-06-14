import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto/appointment.dto';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  async findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('my-appointments')
  async findMyPatientAppointments(@Req() req: any) {
    const userId = req.user.userId;
    return this.appointmentsService.findMyPatientAppointments(userId);
  }

  @Get('doctor-appointments')
  async findMyDoctorAppointments(@Req() req: any) {
    const userId = req.user.userId;
    return this.appointmentsService.findMyDoctorAppointments(userId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string, 
    @Body() updateStatusDto: UpdateAppointmentStatusDto
  ) {
    return this.appointmentsService.updateStatus(id, updateStatusDto);
  }
}