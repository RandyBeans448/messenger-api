import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { FriendRequestService } from '../service/friend-request.service';
import { Request } from 'src/@core/request.interface';
import { AddFriendDTO } from '../dto/add-friend.dto';
import { ResolveFriendRequestDTO } from '../dto/resolve-friend-request.dto';

@Controller('friend-request')
@UseGuards(AuthGuard('jwt'))
@ApiTags('friend-request')
export class FriendRequestController {
  private readonly _logger = new Logger(FriendRequestController.name);
  constructor(private readonly _friendRequestService: FriendRequestService) {}

  @Post('add-friend')
  public async addFriend(@Req() req: Request, @Body() newFriend: AddFriendDTO) {
    try {
      await this._friendRequestService.addFriend(
        req.user.id,
        newFriend.newFriendId,
      );
      this._logger.log(`Added friend with id of: ${newFriend.newFriendId}`);
    } catch (error: any) {
      console.log(error);
      throw new HttpException(
        'Error creating friendship association',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('resolve-friend-request')
  public async resolveFriendRequest(
    @Body() addFriend: ResolveFriendRequestDTO,
  ): Promise<'Friend request accepted' | 'Friend request declined'> {
    try {
      return this._friendRequestService.resolveFriendRequest(addFriend);
    } catch (error: any) {
      console.log(error);
      throw new HttpException(
        'Error creating friendship association',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
