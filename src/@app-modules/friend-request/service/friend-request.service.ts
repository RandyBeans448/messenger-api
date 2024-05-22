import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from '../entities/friend-request.entity';
import { UserService } from 'src/@app-modules/user/services/user.service';
import { AddFriendDTO } from '../dto/add-friend.dto';
import { ResolveFriendRequestDTO } from '../dto/resolve-friend-request.dto';
import { FriendService } from 'src/@app-modules/friend/services/friend.service';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly _friendRequestRepository: Repository<FriendRequest>,
    private readonly _friendService: FriendService,
    private readonly _userService: UserService,
  ) {}

  public async addFriend(userId: string, createFriendDto: AddFriendDTO) {
    try {
      const newFriend: FriendRequest = new FriendRequest();

      newFriend.requestSentBy = await this._userService.getUserById(userId);
      newFriend.receiver = await this._userService.getUserById(
        createFriendDto.id,
      );

      await this._friendRequestRepository.save(newFriend);
    } catch (error: any) {
      console.log(error);
      throw new HttpException(
        'Error creating friendship association',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async resolveFriendRequest(
    userId: string,
    resolveFriendRequestDto: ResolveFriendRequestDTO,
  ) {
    try {
      const friendRequest: FriendRequest =
        await this._friendRequestRepository.findOne({
          where: {
            id: resolveFriendRequestDto.id,
          },
        });

      if (resolveFriendRequestDto.accepted) {
        await this._friendService.addFriend(friendRequest);
        await this.deleteFriend(friendRequest.id);
      } else {
        await this.deleteFriend(friendRequest.id);
      }
    } catch (error: any) {
      throw new HttpException(
        'Error resolving this friendship request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteFriend(id: string): Promise<void> {
    try {
      await this._friendRequestRepository.delete({ id: id });
    } catch (error: any) {
      throw new HttpException(
        'Error deleting friend request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
