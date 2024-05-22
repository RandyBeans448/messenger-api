import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { FriendService } from '../services/friend.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@Controller('friends')
@UseGuards(AuthGuard('jwt'))
@ApiTags('friends')
export class FriendController {
  constructor(private readonly _friendService: FriendService) {}

  @Get(':id')
  async getFriendById(@Param('id') id: string) {
    return this._friendService.getFriendById(id);
  }

  @Get('get-all-friends')
  async getAllFriends(@Req() req) {
    return this._friendService.getAllOfUsersFriends(req.user.id);
  }

  @Delete(':id')
  async deleteFriend(@Param('id') id: string) {
    return this._friendService.deleteFriend(id);
  }
}
