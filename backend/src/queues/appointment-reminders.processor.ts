import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('appointment-reminders')
export class AppointmentRemindersProcessor extends WorkerHost {
  private readonly logger = new Logger(AppointmentRemindersProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing appointment reminder job: ${job.id}`);
    return { status: 'processed' };
  }
}
