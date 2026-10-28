import 'dotenv/config';
import { DynamicModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefillRemindersProcessor } from './refill-reminders.processor';
import { AppointmentRemindersProcessor } from './appointment-reminders.processor';
import { RiskRecalculationProcessor } from './risk-recalculation.processor';
import { ExportJobsProcessor } from './export-jobs.processor';

@Module({
})
export class QueuesModule {
  static register(): DynamicModule {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return {
        module: QueuesModule,
      };
    }

    const url = new URL(redisUrl);
    return {
      module: QueuesModule,
      imports: [
        BullModule.forRoot({
          connection: {
            host: url.hostname,
            port: parseInt(url.port || '6379', 10),
            password: url.password || undefined,
            tls: url.protocol === 'rediss:' ? {} : undefined,
          },
        }),
        BullModule.registerQueue(
          { name: 'refill-reminders' },
          { name: 'appointment-reminders' },
          { name: 'risk-recalculation' },
          { name: 'export-jobs' },
        ),
      ],
      providers: [
        RefillRemindersProcessor,
        AppointmentRemindersProcessor,
        RiskRecalculationProcessor,
        ExportJobsProcessor,
      ],
    };
  }
}
