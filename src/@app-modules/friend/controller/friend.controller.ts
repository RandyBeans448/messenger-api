import { Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Req, UseGuards } from '@nestjs/common';
import { FriendService } from '../services/friend.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Friend } from '../entities/friend.entity';
import { DeleteResult } from 'typeorm';

@Controller('friends')
@UseGuards(AuthGuard('jwt'))
@ApiTags('friends')
export class FriendController {
    // private _logger = new Logger(FriendController.name);
    // constructor(private readonly _friendService: FriendService) { }

    // @Get(':id')
    // async getFriendById(@Param('id') id: string) {
    //     try {
    //         return this._friendService.getFriendById(id);
    //     } catch (error: any) {
    //         this._logger.error(error);
    //         throw new HttpException(
    //             error,
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }

    // @Get('get-all-friends')
    // async getAllFriends(@Req() req): Promise<Friend[]> {
    //     try {
    //         return this._friendService.getAllOfUsersFriends(req.user.id);
    //     } catch (error: any) {
    //         this._logger.error(error);
    //         throw new HttpException(
    //             error,
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }

    // @Delete(':id')
    // async deleteFriend(@Param('id') id: string): Promise<DeleteResult> {
    //     try {
    //         return this._friendService.deleteFriend(id);
    //     } catch (error: any) {
    //         this._logger.error(error);
    //         throw new HttpException(
    //             error,
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }
}
