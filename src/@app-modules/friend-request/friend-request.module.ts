import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestController } from './controller/friend-request.controller';
import { FriendRequestService } from './service/friend-request.service';
import { UserService } from '../user/services/user.service';
import { ConfigService } from '@nestjs/config';
import { Auth0Service } from 'src/@auth/services/auth0.service';
import { FriendRequest } from './entities/friend-request.entity';
import { FriendService } from '../friend/services/friend.service';
import { Friend } from '../friend/entities/friend.entity';
import { User } from '../user/entities/user.entity';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([FriendRequest, Friend, User]),
        ConversationModule,
    ],
    controllers: [FriendRequestController],
    providers: [
        FriendRequestService,
        FriendService,
        ConfigService,
        UserService,
        Auth0Service,
    ],
})
export class FriendRequestModule { }
