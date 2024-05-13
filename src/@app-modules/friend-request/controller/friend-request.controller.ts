import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { FriendRequestService } from '../service/friend-request.service';

@Controller('request')
@UseGuards(AuthGuard('jwt'))
@ApiTags('request')
export class FriendRequestController {
  constructor(private readonly requestService: FriendRequestService) {}
}
