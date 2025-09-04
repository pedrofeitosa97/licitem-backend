import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';

export interface Message {
  id: string;
  roomId: string;
  sender: string;
  content: string;
  createdAt: string;
}

@Injectable()
export class MessagesService {
  constructor(private readonly firebaseService: FirebaseService) {}

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

    return {
      id: msgRef.id,
      roomId,
      sender,
      content,
      createdAt: new Date().toISOString(),
    };
  }
}
