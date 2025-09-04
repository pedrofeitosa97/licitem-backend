import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { Server } from 'socket.io';

export interface Message {
  id: string;
  roomId: string;
  sender: string;
  content: string;
  createdAt: string;
}

@Injectable()
export class MessagesService {
  private server!: Server;

  constructor(private readonly firebaseService: FirebaseService) {}

  setServer(server: Server) {
    this.server = server;
  }

  private get firestore() {
    return this.firebaseService.getFirestore();
  }

  async getMessages(roomId: string): Promise<Message[]> {
    const roomRef = this.firestore.collection('rooms').doc(roomId);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      await roomRef.set({ createdAt: new Date().toISOString() });
    }

    const messagesSnap = await roomRef
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .get();

    return messagesSnap.docs.map((doc) => ({
      id: doc.id,
      roomId,
      ...(doc.data() as any),
    }));
  }

  async addMessage(roomId: string, sender: string, content: string) {
    const roomRef = this.firestore.collection('rooms').doc(roomId);
    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists) {
      await roomRef.set({ createdAt: new Date().toISOString() });
    }

    const messagesRef = roomRef.collection('messages');
    const msgRef = await messagesRef.add({
      sender,
      content,
      createdAt: new Date().toISOString(),
    });

    const messageData: Message = {
      id: msgRef.id,
      roomId,
      sender,
      content,
      createdAt: new Date().toISOString(),
    };

    // ⚡ Emit em tempo real
    this.server?.to(roomId).emit('message', messageData);

    return messageData;
  }
}
