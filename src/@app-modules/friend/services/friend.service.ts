import {
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Friend } from '../entities/friend.entity';
import { UserService } from 'src/@app-modules/user/services/user.service';
import { FriendRequest } from 'src/@app-modules/friend-request/entities/friend-request.entity';
import { Conversation } from 'src/@app-modules/conversation/entities/conversation.entity';
import { ConversationService } from 'src/@app-modules/conversation/services/conversation.service';
import { User } from 'src/@app-modules/user/entities/user.entity';

@Injectable()
export class FriendService {

    private _logger = new Logger(FriendService.name);

    constructor(
        @InjectRepository(Friend)
        private _friendRepository: Repository<Friend>,
        private _conversationService: ConversationService,
        private _userService: UserService,
    ) { }

    public async createNewFriend(
        sender: User,
        receiver: User,
    ): Promise<Friend> {
        try {

            await this._checkToSeeIfFriendShipExists(sender, receiver);

            const newFriend: Friend = new Friend();
            newFriend.user = sender;
            newFriend.friend = receiver;
            return await this._friendRepository.save(newFriend);
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    public async addFriend(acceptedFriendRequest: FriendRequest) {
        try {
            const sender: User = await this._userService.getUserById(acceptedFriendRequest.requestSentBy.id, []);
            const receiver: User = await this._userService.getUserById(acceptedFriendRequest.receiver.id, []);

            const newFriendForSender: Friend = await this._createAndGetFriend(sender, receiver);
            const newFriendForReceiver: Friend = await this._createAndGetFriend(receiver, sender);

            const newConversation: Conversation = await this._conversationService.createConversation([newFriendForSender, newFriendForReceiver]);

            await this._friendRepository.save(newFriendForSender);
            await this._friendRepository.save(newFriendForReceiver);
            await this._conversationService.savedConversation(newConversation);
        } catch (error: any) {
            await this._logger.error(error);
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
            relations: ['user', 'friend', 'conversations'],
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

    private async _checkToSeeIfFriendShipExists(
        sender: User,
        receiver: User,
    ) {
        try {

            const one = await this._findFriendship(sender, receiver);
            const two = await this._findFriendship(receiver, sender);
            
            // const existingFriends: Friend[] = [
            //    await this._findFriendship(sender, receiver),
            //    await this._findFriendship(receiver, sender),
            // ];

            console.log(one)
            console.log(two)

            if (one || two) {
                throw new HttpException(
                    'Friendship already exists',
                    HttpStatus.CONFLICT,
                );
            }
        } catch (error) {
            this._logger.error(error)
            throw new HttpException(
                'Error finding friends',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async _findFriendship(
        sender: User,
        receiver: User,
    ) {
        console.log(sender)
        console.log(receiver)
        try {
            return await this._friendRepository.findOne({
                where: [
                    { user: sender, friend: receiver },
                ],
            });

        } catch (error) {
            console.log(error)
            this._logger.error(error);
            throw new HttpException(
                'Error with finding Friendship',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async _createAndGetFriend(sender: User, receiver: User): Promise<Friend> {
        try {
            const createNewFriend: Friend = await this.createNewFriend(sender, receiver);
            const friend: Friend = await this.getFriendById(createNewFriend.id);
            return friend;
        } catch (error: any) {
            throw new HttpException(
                'Error creating friendship association',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
