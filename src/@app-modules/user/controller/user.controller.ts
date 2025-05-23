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
import { User } from '../entities/user.entity';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { DeleteResult } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'src/@core/request.interface';
import { AuthGuard } from '@nestjs/passport';
import { UserNamespace } from '../namespace/user.namespace';

@Controller('user')
@ApiTags('user')
export class UserController {
    private _logger = new Logger(UserController.name);
    constructor(private readonly _userService: UserService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    public async getUser(
        @Req() req: Request,
    ): Promise<UserNamespace.LoginUserInterface> {

        return {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            friend: req.user.friends,
            friendRequests: req.user.friendRequests,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt,
        };
    }

    @Post('create-new-user')
    public async createUser(
        @Body() createUserDTO: any,
    ): Promise<Partial<User>> {
        try {
            return await this._userService.createUser(createUserDTO);
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
    public async getAllUsers(): Promise<User[]> {
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

    @Get('get-all-users-with-no-pending-requests')
    @UseGuards(AuthGuard('jwt'))
    public async getAllUsersWithNoPendingRequests(@Req() req: Request): Promise<User[]> {
        try {
            return this._userService.getAllUsersWithNoPendingRequests(req.user.id);
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
    public async getUserById(@Param('id') id: string): Promise<User> {
        try {
            return this._userService.getUserById(id, []);
        } catch (error: any) {
            this._logger.error(error);
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    @Get('available-users')
    @UseGuards(AuthGuard('jwt'))
    public async getUsers(@Req() request: Request): Promise<User[]> {
        try {
            return this._userService.getOtherUsers(request.user.id);
        } catch (error: any) {
            this._logger.error(error);
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    @Patch('update-user')
    @UseGuards(AuthGuard('jwt'))
    public async updateUser(@Body() updateUserDto: UpdateUserDTO): Promise<User> {
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
    public async deleteUser(user: User): Promise<DeleteResult> {
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