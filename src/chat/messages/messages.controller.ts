import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import type { Message } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':roomId')
  getMessages(@Param('roomId') roomId: string): Message[] {
    return this.messagesService.getMessages(roomId);
  }

  @Post()
  sendMessage(
    @Body('roomId') roomId: string,
    @Body('sender') sender: string,
    @Body('content') content: string,
  ): Message {
    return this.messagesService.addMessage(roomId, sender, content);
  }
}
