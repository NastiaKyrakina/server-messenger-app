import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessageService } from '../talk/services/message.service';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('MessageGateway');

  constructor(private messageService: MessageService) {}

  @SubscribeMessage('msgToServer')
  public handleMessage(
    client: Socket,
    data: { talk: string; user: string; message: string },
  ): boolean {
    this.messageService.createMessage({
      userId: data.user,
      talkId: data.talk,
      text: data.message,
    });
    this.logger.log(`handleMessage: ${client.id} ${data.message}`);
    return this.server.to(data.talk).emit('msgToClient', {
      talkId: data.talk,
      userId: data.user,
      text: data.message,
    });
  }

  @SubscribeMessage('removeMsgToServer')
  public removeMessage(
    client: Socket,
    data: { talk: string; user: string; messageId: string },
  ): boolean {
    this.messageService.removeMessage(data.user, {
      messageId: data.messageId,
    });
    this.logger.log(`handleMessage: ${client.id} ${data.messageId}`);
    return this.server.to(data.talk).emit('removeMsgToClient', {
      talkId: data.talk,
      userId: data.user,
      id: data.messageId,
    });
  }

  @SubscribeMessage('joinTalk')
  public joinRoom(client: Socket, data: { talk: string; user: number }): void {
    this.logger.log(`join talk: ${data.talk}`);
    client.join(data.talk);
    client.emit('joinedTalk', data.talk);
  }

  @SubscribeMessage('leaveTalk')
  public leaveRoom(client: Socket, data: { talk: string; user: number }): void {
    this.logger.log(`leave talk: ${data.talk}`);
    client.leave(data.talk);
    client.emit('leftRoom', data.talk);
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: WebSocket): void {
    return this.logger.log(`Client connected`);
  }
}
