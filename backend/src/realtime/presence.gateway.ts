import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/presence',
})
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PresenceGateway.name);
  private onlineUsers = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.set(userId, client.id);
      this.server.emit('presence-change', { userId, status: 'online' });
      this.logger.log(`User online: ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = Array.from(this.onlineUsers.entries()).find(([, sId]) => sId === client.id)?.[0];
    if (userId) {
      this.onlineUsers.delete(userId);
      this.server.emit('presence-change', { userId, status: 'offline' });
      this.logger.log(`User offline: ${userId}`);
    }
  }
}
