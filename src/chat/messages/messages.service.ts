import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { Server } from 'socket.io';

@Injectable()
export class MessagesService {
  private server: Server;

  constructor(private readonly firebaseService: FirebaseService) {}

  setServer(server: Server) {
    this.server = server;
  }

  private get firestore() {
    return this.firebaseService.getFirestore();
  }

  async getMessages(roomId: string) {
    const messagesRef = this.firestore
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .orderBy('createdAt', 'asc');

    const snapshot = await messagesRef.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

    const messageData = {
      id: msgRef.id,
      sender,
      content,
      createdAt: new Date().toISOString(),
    };

    if (this.server) {
      this.server.to(roomId).emit('message', { roomId, ...messageData });
    }

    return messageData;
  }
}
