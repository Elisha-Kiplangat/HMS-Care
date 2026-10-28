import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('risk-recalculation')
export class RiskRecalculationProcessor extends WorkerHost {
  private readonly logger = new Logger(RiskRecalculationProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing risk recalculation job: ${job.id}`);
    return { status: 'processed' };
  }
}
