import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from '../services/friend.service';
import { AddFriendDTO } from '../dto/add-friend.dto';
import { ResolveFriendRequestDTO } from '../dto/resolve-friend-request.dto';
import { Request } from 'src/@core/request.interface';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@Controller('friends')
@UseGuards(AuthGuard('jwt'))
@ApiTags('friends')
export class FriendController {
  constructor(private readonly _friendService: FriendService) {}

  @Post('add-friend')
  async addFriend(@Req() req: Request, @Body() addFriend: AddFriendDTO) {
    return this._friendService.addFriend(req.user.id, addFriend);
  }

  @Patch('resolve-friend-request')
  async resolveFriendRequest(
    @Req() req,
    @Body() AddFriend: ResolveFriendRequestDTO,
  ) {
    return this._friendService.resolveFriendRequest(req.user.id, AddFriend);
  }

  // @Get(':id')
  // async getFriendById(@Param('id') id: string) {
  //   return this._friendService.getFriendById(id);
  // }

  @Get('get-all-friends')
  async getAllFriends(@Req() req) {
    console.log('get-all-friends')
    return this._friendService.getAllOfUsersFriends(req.user.id);
  }

  @Delete(':id')
  async deleteFriend(@Param('id') id: string) {
    return this._friendService.deleteFriend(id);
  }
}
