import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './chat/messages/messages.module';
import { RoomsModule } from './chat/rooms/rooms.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    RoomsModule,
    MessagesModule,
    FirebaseModule,
  ],
  controllers: [],
  providers: [FirebaseService],
})
export class AppModule {}
