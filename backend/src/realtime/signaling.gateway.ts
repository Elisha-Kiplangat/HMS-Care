import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/signaling',
})
export class SignalingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SignalingGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected to signaling: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from signaling: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.roomId);
    client.to(data.roomId).emit('user-joined', { socketId: client.id });
    return { status: 'joined', roomId: data.roomId };
  }

  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: { roomId: string; offer: any }, @ConnectedSocket() client: Socket) {
    client.to(data.roomId).emit('offer', { offer: data.offer, senderId: client.id });
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: { roomId: string; answer: any }, @ConnectedSocket() client: Socket) {
    client.to(data.roomId).emit('answer', { answer: data.answer, senderId: client.id });
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(@MessageBody() data: { roomId: string; candidate: any }, @ConnectedSocket() client: Socket) {
    client.to(data.roomId).emit('ice-candidate', { candidate: data.candidate, senderId: client.id });
  }
}
