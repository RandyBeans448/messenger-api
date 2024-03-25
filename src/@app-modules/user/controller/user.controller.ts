import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { DeleteResult } from 'typeorm';

@Controller('user')
export class UserController {
  private _logger = new Logger(UserController.name);
  constructor(private readonly _userService: UserService) {}

  @Post('create-new-user')
  async createUser(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<Partial<User>> {
    try {
      return this._userService.createUser(createUserDTO);
    } catch (error: any) {
      this._logger.error(error);
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get-all-users')
  async getAllUsers(): Promise<User[]> {
    try {
      return this._userService.getAllUsers();
    } catch (error: any) {
      this._logger.error(error);
      throw new HttpException(
        'Error retrieving users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get-user-id')
  async getUserById(id: string): Promise<User> {
    try {
      return this._userService.getUserById(id);
    } catch (error: any) {
      this._logger.error(error);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch('update-user')
  async updateUser(@Body() updateUserDto: UpdateUserDTO): Promise<User> {
    try {
      return this._userService.updateUser(updateUserDto);
    } catch (error: any) {
      this._logger.error(error);
      throw new HttpException(
        'There was an issue updating this user. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete-user')
  async deleteUser(user: User): Promise<DeleteResult> {
    try {
      return this._userService.deleteUser(user);
    } catch (error: any) {
      this._logger.error(error);
      throw new HttpException(
        'There was an issue updating this user. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
