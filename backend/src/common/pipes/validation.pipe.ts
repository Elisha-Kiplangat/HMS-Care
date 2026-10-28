import { ValidationPipe as NestValidationPipe, Injectable } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  }
}
