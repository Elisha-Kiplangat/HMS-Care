import { Module } from '@nestjs/common';
import { Hba1cController } from './hba1c.controller';
import { Hba1cService } from './hba1c.service';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [PatientsModule],
  controllers: [Hba1cController],
  providers: [Hba1cService],
  exports: [Hba1cService],
})
export class Hba1cModule {}
