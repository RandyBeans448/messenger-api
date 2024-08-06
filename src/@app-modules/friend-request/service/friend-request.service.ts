import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FriendRequest } from '../entities/friend-request.entity';
import { UserService } from 'src/@app-modules/user/services/user.service';
import { ResolveFriendRequestDTO } from '../dto/resolve-friend-request.dto';
import { FriendService } from 'src/@app-modules/friend/services/friend.service';
import { Friend } from 'src/@app-modules/friend/entities/friend.entity';

@Injectable()
export class FriendRequestService {
    private _logger: Logger = new Logger(FriendRequestService.name);
    constructor(
        @InjectRepository(FriendRequest)
        private readonly _friendRequestRepository: Repository<FriendRequest>,
        private readonly _friendService: FriendService,
        private readonly _userService: UserService,
    ) { }

    public async addFriend(userId: string, createFriendDto: string) {
        try {
            if (userId === createFriendDto) {
                throw new HttpException(
                    'Cannot add yourself as a friend',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const [user, friendCandidate] = await Promise.all([
                await this._userService.getUserById(userId, ['friends']),
                await this._userService.getUserById(createFriendDto, []),
            ]);

            if (!user || !friendCandidate) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const isAlreadyFriend = user.friends.some(
                (friend: Friend) => friend.friend.id === createFriendDto,
            );

            if (isAlreadyFriend) {
                throw new HttpException(
                    'You are already friends with this user',
                    HttpStatus.CONFLICT,
                );
            }

            const newFriend: FriendRequest = new FriendRequest();
            newFriend.requestSentBy = user;
            newFriend.receiver = friendCandidate;

            await this._friendRequestRepository.save(newFriend);
        } catch (error: any) {
            console.error(error);
            throw new HttpException(
                'Error creating friendship association',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async getReceivedFriendRequests(
        userId: string,
    ): Promise<SelectQueryBuilder<FriendRequest>> {
        try {
            return await this._friendRequestRepository
                .createQueryBuilder('friendRequest')
                .leftJoinAndSelect('friendRequest.requestSentBy', 'requestSentBy')
                .where('friendRequest.receiver.id = :userId', { userId })
                .execute();
        } catch (error: any) {
            this._logger.error(error);
            throw error;
        }
    }

    public async resolveFriendRequest(
        resolveFriendRequestDto: ResolveFriendRequestDTO,
    ): Promise<'Friend request accepted' | 'Friend request declined'> {
        try {
            const friendRequest: FriendRequest =
                await this._friendRequestRepository.findOne({
                    where: {
                        id: resolveFriendRequestDto.friendRequestId,
                    },
                    relations: ['requestSentBy'],
                });

            if (!friendRequest) {
                throw new HttpException(
                    'Friend request not found',
                    HttpStatus.NOT_FOUND,
                );
            }    

            if (resolveFriendRequestDto.response) {
                await this._friendService.addFriend(friendRequest);

                await this.deleteFriend(friendRequest.id);

                return 'Friend request accepted';
            } else {
                await this.deleteFriend(friendRequest.id);
                return 'Friend request declined';
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
