import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { FirebaseModule } from '../../firebase/firebase.module';
import { ChatGateway } from '../chat.gateway';

@Module({
  imports: [FirebaseModule],
  controllers: [MessagesController],
  providers: [ChatGateway, MessagesService],
})
export class MessagesModule {}
