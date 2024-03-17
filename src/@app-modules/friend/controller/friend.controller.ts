import { Controller } from '@nestjs/common';
import { FriendService } from '../services/friend.service';

@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
}
