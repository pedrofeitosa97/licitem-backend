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
    const roomsSnap = await this.firestore.collection('rooms').get();
    return roomsSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));
  }

  async deleteRoom(roomId: string) {
    const roomRef = this.firestore.collection('rooms').doc(roomId);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      throw new Error('Room not found');
    }

    await roomRef.delete();
    return { id: roomId, deleted: true };
  }
}
