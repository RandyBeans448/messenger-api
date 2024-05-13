import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Friend } from '../entities/friend.entity';
import { AddFriendDTO } from '../dto/add-friend.dto';
import { UserService } from 'src/@app-modules/user/services/user.service';
import { ResolveFriendRequestDTO } from '../dto/resolve-friend-request.dto';
import { User } from 'src/@app-modules/user/entities/user.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly _friendRepository: Repository<Friend>,
    private readonly _userService: UserService,
  ) {}

  public async addFriend(userId: string, createFriendDto: AddFriendDTO) {
    try {
      const newFriend: Friend = new Friend();
      const reqUser: User = await this._userService.getUserById(userId);
      const friend: User = await this._userService.getUserById(
        createFriendDto.id,
      );
  
      newFriend.user = reqUser;
      newFriend.friend = friend;

      console.log(newFriend);
      await this._friendRepository.save(newFriend);
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
      const friendRequest: Friend = await this._friendRepository.findOne({
        where: {
          id: resolveFriendRequestDto.id,
        },
      });

      friendRequest.pending = false;
      friendRequest.accepted = resolveFriendRequestDto.accepted;

      if (friendRequest.accepted) {
        await this.addFriend(userId, { id: friendRequest.friend.id });
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

  public async getFriendById(id: string): Promise<Friend> {
    const friend: Friend = await this._friendRepository.findOne({
      where: { id },
    });
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }
    return friend;
  }

  public async getAllFriends(): Promise<Friend[]> {
    try {
      console.log('cory town');
      const friends = await this._friendRepository.find();
      console.log(friends);
      return friends;
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

      console.log(thing);

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
