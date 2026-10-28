import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EmailProvider } from './email.provider';
import { SmsProvider } from './sms.provider';
import { FcmProvider } from './fcm.provider';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailProvider, SmsProvider, FcmProvider],
  exports: [NotificationsService],
})
export class NotificationsModule {}
