import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':roomId')
  getMessages(@Param('roomId') roomId: string) {
    return this.messagesService.getMessages(roomId);
  }

  @Post()
  addMessage(
    @Body('roomId') roomId: string,
    @Body('sender') sender: string,
    @Body('content') content: string,
  ) {
    return this.messagesService.addMessage(roomId, sender, content);
  }
}
