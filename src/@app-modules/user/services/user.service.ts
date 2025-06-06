import {
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../entities/user.entity';
import { Auth0Service } from 'src/@auth/services/auth0.service';
import { UpdateUserDTO } from '../dto/update-user.dto';

@Injectable()
export class UserService {
    private _logger = new Logger('UserService');

    constructor(
        @InjectRepository(User)
        private _userRepository: Repository<User>,
        private _authService: Auth0Service,
    ) { }

    public async getUserByAuthId(auth0Id: string): Promise<User> {
        try {
            const userQuery: SelectQueryBuilder<User> = await this._userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.friends', 'friends')
                .leftJoinAndSelect('friends.friend', 'friend')
                .leftJoinAndSelect('friends.conversations', 'conversations')
                .leftJoinAndSelect('user.friendRequests', 'friendRequests')
                .leftJoinAndSelect('friendRequests.receiver', 'receiver');

            const user: User = await userQuery
                .where('user.auth0Id = :auth0Id', { auth0Id })
                .getOne();

            if (!user) throw new UnauthorizedException();

            return user;
        } catch (error: any) {
            this._logger.error(error);
            throw error;
        }
    }

    public async createUser(
        createUserDTO: any,
    ): Promise<Partial<User>> {
        let user: User = null;
        let userData = {};

        try {
            const existingDeletedUser: User = await this._userRepository.findOne({
                where: { email: createUserDTO.email },
                withDeleted: true,
            });

            if (
                existingDeletedUser &&
                existingDeletedUser.deletedAt === null &&
                existingDeletedUser.auth0Id !== null
            ) {
                throw new HttpException(
                    `User with email ${createUserDTO.email} already exists`,
                    HttpStatus.CONFLICT,
                );
            }

            userData = {
                username: createUserDTO.username,
                email: createUserDTO.email,
                auth0Id: createUserDTO.userId,
            };

            user = await this._userRepository.save(userData).catch((error) => {
                throw error;
            });

            return {
                id: user.id,
                email: user.email,
                username: user.username,
            };

        } catch (error: any) {
            this._logger.error(error);
            throw error;
        }
    }

    public getAllUsers(): Promise<User[]> {
        try {
            return this._userRepository.find();
        } catch (error: any) {
            this._logger.error(error);
            throw error;
        }
    }

    public async getAllUsersWithNoPendingRequests(userId: string): Promise<User[]> {
        try {

            return await this._userRepository
                .createQueryBuilder('user')
                .where('user.id != :userId', { userId })
                .andWhere((qb) => {

                    const subQuerySent: string = qb
                        .subQuery()
                        .select('friendRequest.receiverId')
                        .from('friend_request', 'friendRequest')
                        .where('friendRequest.requestSentById = :userId')
                        .getQuery();

                    const subQueryReceived: string = qb
                        .subQuery()
                        .select('friendRequest.requestSentById')
                        .from('friend_request', 'friendRequest')
                        .where('friendRequest.receiverId = :userId')
                        .getQuery();

                    const subQueryFriends: string = qb
                        .subQuery()
                        .select('friend.friendId')
                        .from('friends', 'friend')
                        .where('friend.userId = :userId')
                        .getQuery();

                    return `
                        user.id NOT IN (${subQuerySent}) AND 
                        user.id NOT IN (${subQueryReceived}) AND 
                        user.id NOT IN (${subQueryFriends})
                      `;
                })
                .getMany();

        } catch (error: any) {
            this._logger.error(error);
            throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getUserById(
        id: string,
        relations: string[],
    ): Promise<User> {
        try {
            return await this._userRepository.findOne({
                where: { id: id },
                relations: relations,
            });
        } catch (error: any) {
            this._logger.error(error);
            throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getOtherUsers(userId: string): Promise<User[]> {
        try {
            return await this._userRepository.find({
                where: {
                    id: Not(userId),
                },
            });
        } catch (error: any) {
            this._logger.error(error);
            throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async updateUser(updateUserDto: UpdateUserDTO): Promise<User> {
        try {
            const user: User = await this.getUserById(updateUserDto.userId, []);

            if (updateUserDto.email) user.email = updateUserDto.email;
            if (updateUserDto.username) user.username = updateUserDto.username;

            return await this._userRepository.save(user);
        } catch (error: any) {
            this._logger.error(error);
            throw error;
        }
    }

    public async deleteUser(
        user: User,
        hardDelete: boolean = false,
    ): Promise<DeleteResult> {
        try {
            const success: DeleteResult = await this._userRepository.softDelete(
                user.id,
            );

            if (user.auth0Id && hardDelete) {
                await this._authService.removeUser(user.auth0Id);
                await this._userRepository.delete(user.id);
            }

            return success;
        } catch (error: any) {
            this._logger.error(error);
            throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
