import { Injectable } from '@nestjs/common';
import { TurnCredentialsService } from './turn-credentials.service';
import { CallSessionService } from './call-session.service';

@Injectable()
export class TelemedicineService {
  constructor(
    private readonly turnCredentialsService: TurnCredentialsService,
    private readonly callSessionService: CallSessionService,
  ) {}

  getIceServers() {
    return this.turnCredentialsService.getIceServers();
  }
}
