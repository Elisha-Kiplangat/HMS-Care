import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import Redis from 'ioredis';

export interface HealthCheckDetail {
  status: 'up' | 'down' | 'disabled';
  responseTimeMs?: number;
  message?: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  checks: {
    database: HealthCheckDetail;
    redis: HealthCheckDetail;
    memory: {
      heapUsed: number;
      heapTotal: number;
      rss: number;
    };
  };
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async checkHealth(): Promise<{ isHealthy: boolean; response: HealthCheckResponse }> {
    const dbCheck = await this.checkDatabase();
    const redisCheck = await this.checkRedis();

    const isHealthy = dbCheck.status === 'up';
    let overallStatus: 'ok' | 'degraded' | 'error' = 'ok';

    if (!isHealthy) {
      overallStatus = 'error';
    } else if (redisCheck.status === 'down') {
      overallStatus = 'degraded';
    }

    const memoryUsage = process.memoryUsage();

    const response: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: this.configService.get<string>('NODE_ENV') || 'development',
      checks: {
        database: dbCheck,
        redis: redisCheck,
        memory: {
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
          rss: memoryUsage.rss,
        },
      },
    };

    return { isHealthy, response };
  }

  private async checkDatabase(): Promise<HealthCheckDetail> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'up',
        responseTimeMs: Date.now() - start,
      };
    } catch (error: any) {
      this.logger.error(`Database health check failed: ${error.message}`);
      return {
        status: 'down',
        responseTimeMs: Date.now() - start,
        message: error.message || 'Database connection error',
      };
    }
  }

  private async checkRedis(): Promise<HealthCheckDetail> {
    const redisUrl =
      this.configService.get<string>('REDIS_URL') ||
      this.configService.get<string>('app.redisUrl');

    if (!redisUrl) {
      return {
        status: 'disabled',
        message: 'REDIS_URL is not configured',
      };
    }

    const start = Date.now();
    let client: Redis | null = null;
    try {
      client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        lazyConnect: true,
      });
      client.on('error', () => {});

      await client.connect();
      await client.ping();
      await client.quit();

      return {
        status: 'up',
        responseTimeMs: Date.now() - start,
      };
    } catch (error: any) {
      if (client) {
        try {
          client.disconnect();
        } catch (_) {}
      }
      this.logger.warn(`Redis health check failed: ${error.message}`);
      return {
        status: 'down',
        responseTimeMs: Date.now() - start,
        message: error.message || 'Redis connection error',
      };
    }
  }
}
