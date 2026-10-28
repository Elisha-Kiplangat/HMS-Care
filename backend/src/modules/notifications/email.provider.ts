import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailProvider {
  private readonly logger = new Logger(EmailProvider.name);

  async sendEmail(to: string, subject: string, body: string) {
    this.logger.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    return { success: true };
  }
}
