import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('HealthController and HealthService', () => {
  let controller: HealthController;
  let service: HealthService;

  const mockPrismaService = {
    $queryRaw: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn<string | undefined, [string]>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'NODE_ENV') return 'test';
      if (key === 'REDIS_URL') return undefined;
      return undefined;
    });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  describe('HealthService.checkHealth', () => {
    it('should return healthy status when database is up and redis disabled', async () => {
      mockPrismaService.$queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);

      const result = await service.checkHealth();

      expect(result.isHealthy).toBe(true);
      expect(result.response.status).toBe('ok');
      expect(result.response.checks.database.status).toBe('up');
      expect(result.response.checks.redis.status).toBe('disabled');
      expect(result.response.environment).toBe('test');
      expect(result.response.uptime).toBeGreaterThanOrEqual(0);
      expect(result.response.timestamp).toBeDefined();
    });

    it('should return degraded status when database is up but redis is down', async () => {
      mockPrismaService.$queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'test';
        if (key === 'REDIS_URL') return 'redis://localhost:99999';
        return undefined;
      });

      const result = await service.checkHealth();

      expect(result.isHealthy).toBe(true);
      expect(result.response.status).toBe('degraded');
      expect(result.response.checks.database.status).toBe('up');
      expect(result.response.checks.redis.status).toBe('down');
    });

    it('should return error status when database fails', async () => {
      mockPrismaService.$queryRaw.mockRejectedValueOnce(new Error('Connection refused'));

      const result = await service.checkHealth();

      expect(result.isHealthy).toBe(false);
      expect(result.response.status).toBe('error');
      expect(result.response.checks.database.status).toBe('down');
      expect(result.response.checks.database.message).toBe('Connection refused');
    });
  });

  describe('HealthController.checkHealth', () => {
    it('should respond with HTTP 200 when healthy', async () => {
      mockPrismaService.$queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);

      const mockResponseJson = jest.fn();
      const mockResponseStatus = jest.fn().mockReturnValue({ json: mockResponseJson });
      const mockRes = { status: mockResponseStatus } as unknown as Response;

      await controller.checkHealth(mockRes);

      expect(mockResponseStatus).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ok',
        }),
      );
    });

    it('should respond with HTTP 503 when database is down', async () => {
      mockPrismaService.$queryRaw.mockRejectedValueOnce(new Error('DB Down'));

      const mockResponseJson = jest.fn();
      const mockResponseStatus = jest.fn().mockReturnValue({ json: mockResponseJson });
      const mockRes = { status: mockResponseStatus } as unknown as Response;

      await controller.checkHealth(mockRes);

      expect(mockResponseStatus).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
      expect(mockResponseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
        }),
      );
    });
  });
});
