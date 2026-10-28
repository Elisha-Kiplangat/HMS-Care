import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PseudonymizationService {
  pseudonymizeId(id: string, secret: string = 'hms-export-salt'): string {
    return crypto.createHmac('sha256', secret).update(id).digest('hex').substring(0, 16);
  }
}
