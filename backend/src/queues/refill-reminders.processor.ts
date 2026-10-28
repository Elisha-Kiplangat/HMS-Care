import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('refill-reminders')
export class RefillRemindersProcessor extends WorkerHost {
  private readonly logger = new Logger(RefillRemindersProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing refill reminder job: ${job.id}`);
    return { status: 'processed' };
  }
}
