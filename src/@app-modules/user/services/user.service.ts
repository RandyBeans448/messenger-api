import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../entities/user.entity';
import { Auth0Service } from 'src/@auth/services/auth0.service';
import { CreateUserDTO } from '../dto/create-user.dto';

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
      console.log(error);
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
        auth0Id: authUser.user_id,
      };

      user = await this._userRepository.save(userData).catch((error) => {
        throw error;
      });
    } catch (error: any) {
      // if (user) {
      //   this.deleteUser(user);
      // }
      // if (authUser) {
      //   this._authService.removeUser(authUser._id);
      // }
      throw error;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  // public async deleteUser(
  //   user: User,
  //   hardDelete: boolean = false,
  // ): Promise<DeleteResult> {
  //   try {
  //     const success: DeleteResult = await this._userRepository.softDelete(
  //       user.id,
  //     );
  //     if (user.auth0Id && hardDelete) {
  //       this._authService.removeUser(user.auth0Id);
  //     }

  //     return success;
  //   } catch (error: any) {
  //     this._logger.error(error);
  //   }
  // }
}