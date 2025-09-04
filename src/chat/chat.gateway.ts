import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages/messages.service';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  afterInit() {
    console.log('WebSocket Gateway inicializado');
    // this.messagesService.setServer(this.server);
  }

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    console.log(`Cliente ${client.id} entrou na sala ${roomId}`);
  }

  // REMOVIDO o addMessage daqui para não duplicar
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { roomId: string; user: string; message: string },
  ) {
    const msg = await this.messagesService.addMessage(
      data.roomId,
      data.user,
      data.message,
    );

    this.server.to(data.roomId).emit('message', msg);
    console.log(`Mensagem emitida para a sala ${data.roomId}`, msg);
  }
}
