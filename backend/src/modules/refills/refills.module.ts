import { Module } from '@nestjs/common';
import { RefillsController } from './refills.controller';
import { RefillsService } from './refills.service';
import { RefillReminderScheduler } from './refill-reminder.scheduler';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [PatientsModule],
  controllers: [RefillsController],
  providers: [RefillsService, RefillReminderScheduler],
  exports: [RefillsService, RefillReminderScheduler],
})
export class RefillsModule {}
