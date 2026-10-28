import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsProvider {
  private readonly logger = new Logger(SmsProvider.name);

  async sendSms(to: string, message: string) {
    this.logger.log(`[Africa's Talking SMS Mock] To: ${to} | Message: ${message}`);
    return { success: true };
  }
}
