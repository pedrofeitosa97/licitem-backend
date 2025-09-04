import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';

@Injectable()
export class RoomsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  private get firestore() {
    return this.firebaseService.getFirestore();
  }

  async createRoom(name: string) {
    const roomRef = this.firestore.collection('rooms').doc();
    await roomRef.set({
      name,
      createdAt: new Date().toISOString(),
    });
    return { id: roomRef.id, name };
  }

  async getRooms() {
    const snapshot = await this.firestore.collection('rooms').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async deleteRoom(roomId: string) {
    const roomRef = this.firestore.collection('rooms').doc(roomId);
    const messagesRef = roomRef.collection('messages');

    const messagesSnapshot = await messagesRef.get();
    const batch = this.firestore.batch();
    messagesSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
    batch.delete(roomRef);
    await batch.commit();

    return { id: roomId };
  }
}
