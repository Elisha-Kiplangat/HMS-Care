import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailProvider } from './email.provider';
import { SmsProvider } from './sms.provider';
import { FcmProvider } from './fcm.provider';
import { NotificationChannel } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailProvider: EmailProvider,
    private readonly smsProvider: SmsProvider,
    private readonly fcmProvider: FcmProvider,
  ) {}

  async sendNotification(userId: string, channel: NotificationChannel, title: string, body: string, data?: any) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        channel,
        title,
        body,
        data: data || undefined,
      },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return notification;

    if (channel === NotificationChannel.EMAIL && user.email) {
      await this.emailProvider.sendEmail(user.email, title, body);
    } else if (channel === NotificationChannel.SMS && user.phone) {
      await this.smsProvider.sendSms(user.phone, `${title}: ${body}`);
    } else if (channel === NotificationChannel.PUSH) {
      const deviceToken = await this.prisma.deviceToken.findFirst({ where: { userId } });
      if (deviceToken) {
        await this.fcmProvider.sendPushNotification(deviceToken.token, title, body);
      }
    }

    return notification;
  }

  async registerDeviceToken(userId: string, token: string, platform: string) {
    return this.prisma.deviceToken.upsert({
      where: { token },
      update: { userId, platform },
      create: { userId, token, platform },
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: 20,
    });
  }
}
