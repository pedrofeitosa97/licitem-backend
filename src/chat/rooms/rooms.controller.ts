import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomDto } from './dto/room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body('name') name: string): RoomDto {
    return this.roomsService.createRoom(name);
  }

  @Get()
  list(): RoomDto[] {
    return this.roomsService.getRooms();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return { deleted: id };
  }
}
