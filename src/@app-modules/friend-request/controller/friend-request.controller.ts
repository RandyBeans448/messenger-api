import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { FriendRequestService } from '../service/friend-request.service';
import { Request } from 'src/@core/request.interface';
import { AddFriendDTO } from '../dto/add-friend.dto';
import { ResolveFriendRequestDTO } from '../dto/resolve-friend-request.dto';
import { SelectQueryBuilder } from 'typeorm';
import { FriendRequest } from '../entities/friend-request.entity';

@Controller('friend-request')
@UseGuards(AuthGuard('jwt'))
@ApiTags('friend-request')
export class FriendRequestController {
    private readonly _logger = new Logger(FriendRequestController.name);
    constructor(private readonly _friendRequestService: FriendRequestService) { }

    @Get('get-received-friend-requests')
    async getReceivedFriendRequests(
        @Req() req,
    ): Promise<SelectQueryBuilder<FriendRequest>> {
        try {
            return await this._friendRequestService.getReceivedFriendRequests(
                req.user.id,
            );
        } catch (error: any) {
            this._logger.error(error);
            throw new HttpException(
                'Error retrieving users',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('add-friend')
    public async addFriend(
        @Req() req: Request,
        @Body() newFriend: AddFriendDTO,
    ): Promise<void> {
        try {

            await this._friendRequestService.addFriend(
                req.user.id,
                newFriend.newFriendId,
            );

            this._logger.log(`Added friend with id of: ${newFriend.newFriendId}`);
        } catch (error: any) {
            await this._logger.error(error);
            throw new HttpException(
                'Error creating friendship association',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Patch('resolve-friend-request')
    public async resolveFriendRequest(
        @Body() addFriend: ResolveFriendRequestDTO,
    ): Promise<any> {
        try {
            return this._friendRequestService.resolveFriendRequest(addFriend);
        } catch (error: any) {
            await this._logger.error(error);
            throw new HttpException(
                'Error creating friendship association',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
