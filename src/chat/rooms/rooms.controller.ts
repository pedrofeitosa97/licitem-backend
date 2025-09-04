import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  createRoom(@Body('name') name: string) {
    return this.roomsService.createRoom(name);
  }

  @Get()
  getRooms() {
    return this.roomsService.getRooms();
  }

  @Delete(':id')
  deleteRoom(@Param('id') roomId: string) {
    return this.roomsService.deleteRoom(roomId);
  }
}
