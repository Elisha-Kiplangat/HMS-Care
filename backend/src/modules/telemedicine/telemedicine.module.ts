import { Module } from '@nestjs/common';
import { TelemedicineController } from './telemedicine.controller';
import { TelemedicineService } from './telemedicine.service';
import { TurnCredentialsService } from './turn-credentials.service';
import { CallSessionService } from './call-session.service';

@Module({
  controllers: [TelemedicineController],
  providers: [TelemedicineService, TurnCredentialsService, CallSessionService],
  exports: [TelemedicineService, CallSessionService],
})
export class TelemedicineModule {}
