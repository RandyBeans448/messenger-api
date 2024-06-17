import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Headers,
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
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'src/@core/request.interface';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';

@Controller('user')
@ApiTags('user')
export class UserController {
  private _logger = new Logger(UserController.name);
  constructor(private readonly _userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req: Request): Promise<any> {
    const user: User = req.user;
    console.log(user, 'this user cunt');
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      friend: user.friends,
      friendRequests: user.friendRequests,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  @Post('create-new-user')
  async createUser(
    @Req() request: Request,
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<Partial<User>> {
    try {
      const headers: IncomingHttpHeaders = request.headers;
      const idempotencyKey: string | string[] = headers['idempotency-key'];
      return await this._userService.createUser(createUserDTO, idempotencyKey);
    } catch (error: any) {
      this._logger.error(error);
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get-all-users')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  async getUserById(@Param('id') id: string): Promise<User> {
    try {
      return this._userService.getUserById(id, []);
    } catch (error: any) {
      this._logger.error(error);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch('update-user')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
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
