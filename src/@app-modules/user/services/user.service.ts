import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../entities/user.entity';
import { Auth0Service } from 'src/@auth/services/auth0.service';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { CreateUserDTO } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  private _logger = new Logger('UserService');

  private seenIdempotencyKeys = new Set();

  constructor(
    @InjectRepository(User)
    private _userRepository: Repository<User>,
    private _authService: Auth0Service,
  ) {}

  public async getUserByAuthId(auth0Id: string): Promise<User> {
    try {
      const userQuery: SelectQueryBuilder<User> = await this._userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.friends', 'friends') // Assuming 'friends' is the relation in the User entity
        .leftJoinAndSelect('friends.friend', 'friend') // Join friends' friends, alias it as 'friend'
        .leftJoinAndSelect('user.friendRequests', 'friendRequests') // Assuming 'friendRequests' is the relation in the User entity
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
    createUserDTO: CreateUserDTO,
    idempotencyKey: string | string[],
  ): Promise<Partial<User>> {
    let user: User = null;
    let authUser = null;
    let userData = {};

    // Check if the idempotency key has been seen before
    if (this.seenIdempotencyKeys.has(idempotencyKey)) {
      throw new HttpException(
        'Idempotency key already seen before',
        HttpStatus.CONFLICT,
      );
    }

    // Store the idempotency key
    this.seenIdempotencyKeys.add(idempotencyKey);

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

      authUser = await this._authService.createUser(
        createUserDTO.email,
        createUserDTO.username,
      );

      userData = {
        ...userData,
        username: createUserDTO.username,
        email: createUserDTO.email,
        auth0Id: authUser.data.user_id,
      };

      user = await this._userRepository.save(userData).catch((error) => {
        throw error;
      });
    } catch (error: any) {
      this._logger.error(error);
      throw error;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }

  public getAllUsers(): Promise<User[]> {
    try {
      return this._userRepository.find();
    } catch (error: any) {
      console.log(error);
      this._logger.error(error);
      throw error;
    }
  }

  public async getUserById(id: string, relations: string[]): Promise<User> {
    try {
      return await this._userRepository.findOne({
        where: { id: id },
        relations: relations,
      });
    } catch (error: any) {
      console.log(error);
      this._logger.error(error);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  public async updateUser(updateUserDto: UpdateUserDTO): Promise<User> {
    try {
      const user: User = await this.getUserById(updateUserDto.userId, []);

      if (updateUserDto.email) user.email = updateUserDto.email;
      if (updateUserDto.username) user.username = updateUserDto.username;

      // if (updateUserDto.password)
      //   await this._authService.updateUserPassword(updateUserDto.password);

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
      throw error;
    }
  }
}
