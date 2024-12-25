import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestController } from './controller/friend-request.controller';
import { FriendRequestService } from './service/friend-request.service';
import { FriendRequest } from './entities/friend-request.entity';
import { FriendModule } from '../friend/friend.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([FriendRequest]),
        FriendModule,
        UserModule,
    ],
    controllers: [FriendRequestController],
    providers: [
        FriendRequestService,
    ],
})
export class FriendRequestModule { }
