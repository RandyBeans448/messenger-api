import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
@ApiTags('user')
export class UserController {
  private _logger = new Logger(UserController.name);
  constructor(private readonly _userService: UserService) {}

  @Get()
  async getUser(@Req() req): Promise<any> {
    const user: User = req.user;
    console.log(user);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      friends: user.friends,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

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

  @Get('get-user-id/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
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
        'There was an issue deleting this user. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
