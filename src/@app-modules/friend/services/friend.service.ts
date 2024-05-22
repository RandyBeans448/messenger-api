import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Friend } from '../entities/friend.entity';
import { UserService } from 'src/@app-modules/user/services/user.service';
import { FriendRequest } from 'src/@app-modules/friend-request/entities/friend-request.entity';
import { User } from 'src/@app-modules/user/entities/user.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly _friendRepository: Repository<Friend>,
    private readonly _userService: UserService,
  ) {}

  public async addFriend(acceptedFriendRequest: FriendRequest) {
    try {
      const newFriendForSender: Friend = new Friend();
      const newFriendForReceiver: Friend = new Friend();

      const sender: User = await this._userService.getUserById(
        acceptedFriendRequest.requestSentBy.id,
      );

      const receiver: User = await this._userService.getUserById(
        acceptedFriendRequest.receiver.id,
      );

      newFriendForSender.user = sender;
      newFriendForSender.friend = receiver;

      newFriendForReceiver.user = receiver;
      newFriendForReceiver.friend = sender;

      await this._friendRepository.save(newFriendForSender);
      await this._friendRepository.save(newFriendForReceiver);
    } catch (error: any) {
      console.log(error);
      throw new HttpException(
        'Error creating friendship association',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // public async resolveFriendRequest(
  //   userId: string,
  //   resolveFriendRequestDto: ResolveFriendRequestDTO,
  // ) {
  //   try {
  //     const friendRequest: Friend = await this._friendRepository.findOne({
  //       where: {
  //         id: resolveFriendRequestDto.id,
  //       },
  //     });

  //     // friendRequest.pending = false;
  //     // friendRequest.accepted = resolveFriendRequestDto.accepted;

  //     // if (friendRequest.accepted) {
  //     //   await this.addFriend(user, { id: friendRequest.friend.id });
  //     // } else {
  //     //   await this.deleteFriend(friendRequest.id);
  //     // }
  //   } catch (error: any) {
  //     throw new HttpException(
  //       'Error resolving this friendship request',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  public async getFriendById(id: string): Promise<Friend> {
    const friend: Friend = await this._friendRepository.findOne({
      where: { id },
      relations: ['user', 'friend'],
    });
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }
    return friend;
  }

  public async getAllFriends(): Promise<Friend[]> {
    try {
      return await this._friendRepository.find();
    } catch (error: any) {
      throw new HttpException(
        'Error can not get friendship associations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getAllOfUsersFriends(userId: string): Promise<Friend[]> {
    try {
      const thing = await this._friendRepository.find();
      // .createQueryBuilder('friends')
      // .leftJoinAndSelect('friends.user', 'user')
      // .leftJoinAndSelect('friends.friend', 'friend')
      // .where('friends.userId = :userId', { userId })
      // .getMany();

      return thing;
    } catch (error: any) {
      console.log(error);
      throw new HttpException(
        'Error getting friends list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteFriend(id: string): Promise<DeleteResult> {
    try {
      return await this._friendRepository.delete(id);
    } catch (error: any) {
      throw new HttpException(
        'Error deleting friend',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
