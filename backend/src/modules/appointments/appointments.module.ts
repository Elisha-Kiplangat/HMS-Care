import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { PatientsModule } from '../patients/patients.module';
import { CliniciansModule } from '../clinicians/clinicians.module';

@Module({
  imports: [PatientsModule, CliniciansModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
