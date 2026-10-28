import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FcmProvider {
  private readonly logger = new Logger(FcmProvider.name);

  async sendPushNotification(deviceToken: string, title: string, body: string) {
    this.logger.log(`[FCM Push Mock] Token: ${deviceToken} | ${title}: ${body}`);
    return { success: true };
  }
}
