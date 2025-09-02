import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [AuthModule, RoomsModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
