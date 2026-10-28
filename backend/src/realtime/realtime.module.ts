import { Module } from '@nestjs/common';
import { SignalingGateway } from './signaling.gateway';
import { PresenceGateway } from './presence.gateway';

@Module({
  providers: [SignalingGateway, PresenceGateway],
  exports: [SignalingGateway, PresenceGateway],
})
export class RealtimeModule {}
