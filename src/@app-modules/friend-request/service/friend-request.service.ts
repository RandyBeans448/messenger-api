import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { FriendRequest } from '../entities/friend-request.entity';
import { UserService } from 'src/@app-modules/user/services/user.service';
import { ResolveFriendRequestDTO } from '../dto/resolve-friend-request.dto';
import { FriendService } from 'src/@app-modules/friend/services/friend.service';
import { Friend } from 'src/@app-modules/friend/entities/friend.entity';
import { User } from 'src/@app-modules/user/entities/user.entity';

@Injectable()
export class FriendRequestService {
    // private _logger: Logger = new Logger(FriendRequestService.name);
    // constructor(
    //     @InjectRepository(FriendRequest)
    //     private readonly _friendRequestRepository: Repository<FriendRequest>,
    //     private readonly _friendService: FriendService,
    //     private readonly _userService: UserService,
    // ) { }

    // public async addFriend(
    //     userId: string,
    //     createFriendDto: string,
    // ): Promise<FriendRequest> {
    //     try {

    //         if (userId === createFriendDto) {
    //             throw new HttpException(
    //                 'Cannot add yourself as a friend',
    //                 HttpStatus.BAD_REQUEST,
    //             );
    //         }

    //         const doesFriendRequestAlreadyExist: FriendRequest = await this._friendRequestRepository.findOne({
    //             where: {
    //                 requestSentBy: { id: userId },
    //                 receiver: { id: createFriendDto },
    //             },
    //         });

    //         if (doesFriendRequestAlreadyExist) {
    //             throw new HttpException(
    //                 'Friend request already exists',
    //                 HttpStatus.CONFLICT,
    //             );
    //         }

    //         const user: User = await this._userService.getUserById(
    //             userId,
    //             [],
    //         );

    //         const friendCandidate: User = await this._userService.getUserById(
    //             createFriendDto,
    //             [],
    //         );

    //         if (!user || !friendCandidate) {
    //             throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    //         }

    //         const newFriend: FriendRequest = new FriendRequest();
    //         newFriend.requestSentBy = user;
    //         newFriend.receiver = friendCandidate;

    //         return await this._friendRequestRepository.save(newFriend);
    //     } catch (error: any) {
    //         throw new HttpException(
    //             error.message,
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }

    // public async getReceivedFriendRequests(
    //     userId: string,
    // ): Promise<SelectQueryBuilder<FriendRequest>> {
    //     try {
    //         return await this._friendRequestRepository
    //             .createQueryBuilder('friendRequest')
    //             .leftJoinAndSelect('friendRequest.requestSentBy', 'requestSentBy')
    //             .leftJoinAndSelect('friendRequest.receiver', 'receiver')
    //             .where(
    //                 new Brackets((qb) => {
    //                     qb.where('friendRequest.requestSentBy.id = :userId', { userId })
    //                       .orWhere('friendRequest.receiver.id = :userId', { userId });
    //                 }),
    //             )
    //             .execute();
    //     } catch (error: any) {
    //         this._logger.error(error);
    //         throw error;
    //     }
    // }

    // public async resolveFriendRequest(
    //     resolveFriendRequestDto: ResolveFriendRequestDTO,
    // ): Promise<any> {

    //     try {
    //         const friendRequest: FriendRequest =
    //             await this._friendRequestRepository.findOne({
    //                 where: { id: resolveFriendRequestDto.friendRequestId },
    //                 relations: ['requestSentBy', 'receiver'],
    //             });
    
    //         if (!friendRequest) {
    //             throw new HttpException('Friend request not found', HttpStatus.NOT_FOUND);
    //         }
    
    //         if (resolveFriendRequestDto.response) {
    //             // Execute addFriend and deleteFriend in parallel
    //             await Promise.all([
    //                 this._friendService.addFriend(friendRequest),
    //                 this.deleteFriendRequest(friendRequest.id),
    //             ]);

    //             return { message: 'Friend request accepted' };
    //         } else {
    //             // Decline only deletes the request
    //             await this.deleteFriendRequest(friendRequest.id);
    //             return { message: 'Friend request declined' };
    //         }
    //     } catch (error: any) {
    //         throw new HttpException(
    //             'Error resolving this friendship request',
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }
    

    // public async deleteFriendRequest(id: string): Promise<void> {
    //     try {
    //         await this._friendRequestRepository.delete({ id: id });
    //     } catch (error: any) {
    //         throw new HttpException(
    //             'Error deleting friend request',
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }
}
