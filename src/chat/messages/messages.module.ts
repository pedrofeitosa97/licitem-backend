import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ChatGateway } from '../chat.gateway';

@Module({
  controllers: [MessagesController],
  providers: [ChatGateway, MessagesService],
})
export class MessagesModule {}
