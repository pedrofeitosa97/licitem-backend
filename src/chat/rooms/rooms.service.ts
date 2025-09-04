import { Injectable } from '@nestjs/common';
import { RoomDto } from './dto/room.dto';

interface Room {
  id: string;
  name: string;
  users: string[];
}

@Injectable()
export class RoomsService {
  private rooms: Room[] = [];

  createRoom(name: string): RoomDto {
    const room = { id: Date.now().toString(), name, users: [] };
    this.rooms.push(room);
    return { ...room };
  }

  getRooms(): RoomDto[] {
    return this.rooms.map((r) => ({ ...r }));
  }

  addUser(roomId: string, username: string) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (room && !room.users.includes(username)) {
      room.users.push(username);
    }
  }

  removeUser(roomId: string, username: string) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (room) {
      room.users = room.users.filter((u) => u !== username);
    }
  }
}
