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
import { CryptoKeyService } from 'src/@app-modules/crypto-key/services/crypto-key.services';
import { CryptoKeys } from 'src/@app-modules/crypto-key/entities/crypto-key.entity';

@Injectable()
export class FriendService {

    private _logger = new Logger(FriendService.name);

    constructor(
        @InjectRepository(Friend)
        private _friendRepository: Repository<Friend>,
        private _userService: UserService,
        private _conversationService: ConversationService,
        // private readonly _cryptoKeyService: CryptoKeyService,
    ) { }

    public async addFriend(acceptedFriendRequest: FriendRequest) {
        try {

            const [sender, receiver] = await Promise.all([
                this._userService.getUserById(acceptedFriendRequest.requestSentBy.id, []),
                this._userService.getUserById(acceptedFriendRequest.receiver.id, []),
            ]);

            const [newFriendForSender, newFriendForReceiver] = await Promise.all([
                this._createAndGetFriend(sender, receiver),
                this._createAndGetFriend(receiver, sender),
            ]);

            const newConversation: Conversation = await this._conversationService.createConversation([
                newFriendForSender,
                newFriendForReceiver,
            ]);

            await this._conversationService.savedConversation(newConversation);

            newFriendForSender.conversations = newConversation;
            newFriendForReceiver.conversations = newConversation;

            await this._friendRepository.save(newFriendForSender);
            await this._friendRepository.save(newFriendForReceiver);

            await this._createCryptoKeys(newConversation);

        } catch (error) {
            console.error(error);
            throw new HttpException(
                'Error adding friend',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async getFriendById(id: string): Promise<Friend> {
        try {
            return await this._friendRepository.findOne({
                where: { id },
                relations: ['user', 'friend', 'conversations'],
            });
        } catch (error: any) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async getAllFriends(): Promise<Friend[]> {
        try {
            return await this._friendRepository.find();
        } catch (error: any) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async getAllOfUsersFriends(userId: string): Promise<Friend[]> {
        try {
            return await this._friendRepository.find({
                where: [
                    { user: { id: userId } },
                ],
            });
        } catch (error: any) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async updateFriend(friend: Friend): Promise<Friend> {
        try {
            if (!friend) {
                throw new NotFoundException('Friend not found');
            }

            return await this._friendRepository.save(friend);
        } catch (error: any) {
            await this._logger.error(error);
            throw new HttpException(
                'Error updating friend',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async deleteFriend(id: string): Promise<DeleteResult> {
        try {
            return await this._friendRepository.delete(id);
        } catch (error: any) {
            this._logger.error(error)
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async alreadyFriends(
        userId: string,
        friendId: string,
    ): Promise<boolean> {
        const isAlreadyFriend: Friend = await this._friendRepository.findOne({
            where: {
                user: { id: userId },
                friend: { id: friendId },
            },
        });

        return isAlreadyFriend ? true : false;
    }

    private async _checkToSeeIfFriendShipExists(
        sender: User,
        receiver: User,
    ): Promise<boolean> {
        try {

            const existingFriends: Friend[] = [
                await this._findFriendship(sender, receiver),
                await this._findFriendship(receiver, sender),
            ];

            if (existingFriends[0] === null || existingFriends[1] === null) {
                return false;
            } else {
                return true;
            }

        } catch (error) {
            this._logger.error(error)
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async _findFriendship(
        sender: User,
        receiver: User,
    ): Promise<Friend> {
        try {
            return await this._friendRepository.findOne({
                where: [
                    { user: sender, friend: receiver },
                ],
            });

        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async _createAndGetFriend(
        sender: User,
        receiver: User,
    ): Promise<Friend> {
        try {
            const createNewFriend: Friend = await this._createNewFriend(sender, receiver);
            return await this.getFriendById(createNewFriend.id);
        } catch (error: any) {
            await this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async _createNewFriend(
        sender: User,
        receiver: User,
    ): Promise<Friend> {
        try {

            const doesFriendshipExist: boolean = await this._checkToSeeIfFriendShipExists(sender, receiver);

            if (doesFriendshipExist) {
                throw new HttpException('Friendship already exists', HttpStatus.BAD_REQUEST);
            }

            const newFriend: Friend = new Friend();

            newFriend.user = sender;
            newFriend.friend = receiver;

            return await this._friendRepository.save(newFriend);
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async _createCryptoKeys(conversation: Conversation): Promise<Friend[]> {
        try {
            // const keys: CryptoKeys[] = await this._cryptoKeyService.createCryptoKeys(conversation);

            const friendOne: Friend = conversation.friend[0];
            const friendTwo: Friend = conversation.friend[1];

            // friendOne.cryptoKey = keys[0];
            // friendTwo.cryptoKey = keys[1];
   
            return await Promise.all([
                await this.updateFriend(friendOne),
                await this.updateFriend(friendTwo),
            ]);

        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
