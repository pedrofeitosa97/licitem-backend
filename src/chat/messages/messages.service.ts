import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

export interface Message {
  id: string;
  roomId: string;
  sender: string;
  content: string;
  createdAt: Date;
}

@Injectable()
export class MessagesService {
  private messages: Message[] = [];
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  addMessage(roomId: string, sender: string, content: string): Message {
    const message: Message = {
      id: Date.now().toString(),
      roomId,
      sender,
      content,
      createdAt: new Date(),
    };
    this.messages.push(message);

    // Emit apenas se o servidor de socket estiver definido
    if (this.server) {
      this.server.to(roomId).emit('message', message);
    }

    return message;
  }

  getMessages(roomId: string): Message[] {
    return this.messages.filter((m) => m.roomId === roomId);
  }
}
