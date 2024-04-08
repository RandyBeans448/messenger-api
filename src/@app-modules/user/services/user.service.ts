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
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  private _logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private _userRepository: Repository<User>,
    private _authService: Auth0Service,
  ) {}

  public async getUserByAuthId(auth0Id: string): Promise<User> {
    try {
      const userQuery: SelectQueryBuilder<User> = await this._userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.friends', 'friends');

      const user: User = await userQuery
        .where('user.auth0Id = :auth0Id', { auth0Id })
        .getOne();

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error: any) {
      this._logger.error(error);
      throw error;
    }
  }

  public async createUser(
    createUserDTO: CreateUserDTO,
  ): Promise<Partial<User>> {
    let user: User = null;
    let authUser = null;
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

      // if (existingDeletedUser) {
      //   return await this._reactiveUser(existingDeletedUser);
      // }

      authUser = await this._authService.createUser(
        createUserDTO.email,
        createUserDTO.firstName,
        createUserDTO.lastName,
        createUserDTO.password,
        { verifyEmail: true },
      );

      userData = {
        ...userData,
        firstName: createUserDTO.firstName,
        lastName: createUserDTO.lastName,
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
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  public getAllUsers(): Promise<User[]> {
    return this._userRepository.find();
  }

  public async getUserById(id: string): Promise<User> {
    return await this._userRepository.findOne({
      where: { id },
    });
  }

  public async updateUser(updateUserDto: UpdateUserDTO): Promise<User> {
    try {
      const user: User = await this.getUserById(updateUserDto.userId);

      if (updateUserDto.email) user.email = updateUserDto.email;
      if (updateUserDto.firstName) user.firstName = updateUserDto.firstName;
      if (updateUserDto.lastName) user.lastName = updateUserDto.lastName;

      if (updateUserDto.password)
        await this._authService.updateUserPassword(updateUserDto.password);

      return await this._userRepository.save(user);
    } catch (error: any) {
      this._logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
    }
  }
}
