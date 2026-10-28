import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || configService.get<number>('app.port') || 3000;
  const corsOrigins = configService.get<string[]>('app.cors.origins') || ['*'];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.setGlobalPrefix('api/v1', { exclude: ['health'] });

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('HMS API')
    .setDescription('Modular monolith REST API for HMS Type 2 Diabetes Glycemic Control Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port, '0.0.0.0');
  logger.log(`HMS Backend running on port ${port} (Global prefix: /api/v1)`);
  logger.log(`Swagger documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
