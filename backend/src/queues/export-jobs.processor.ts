import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('export-jobs')
export class ExportJobsProcessor extends WorkerHost {
  private readonly logger = new Logger(ExportJobsProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing export job: ${job.id}`);
    return { status: 'processed' };
  }
}
