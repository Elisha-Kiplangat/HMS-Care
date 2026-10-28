import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TurnCredentialsService {
  constructor(private readonly configService: ConfigService) {}

  getIceServers() {
    const turnUrls = this.configService.get<string>('TURN_URLS') || 'stun:stun.l.google.com:19302';
    const turnSecret = this.configService.get<string>('TURN_SECRET') || 'demo-secret';

    return [
      { urls: turnUrls },
      {
        urls: turnUrls.replace('stun:', 'turn:'),
        username: 'hms-user',
        credential: turnSecret,
      },
    ];
  }
}
