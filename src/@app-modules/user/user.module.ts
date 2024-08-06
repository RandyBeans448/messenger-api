import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from '../conversation/entities/conversation.entity';
import { Friend } from '../friend/entities/friend.entity';
import { Message } from '../message/entities/message.entity';
import { UserController } from './controller/user.controller';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { ConfigService } from '@nestjs/config';
import { Auth0Service } from 'src/@auth/services/auth0.service';
import { FriendRequestModule } from '../friend-request/friend-request.module';

@Module({
    imports: [
        FriendRequestModule,
        TypeOrmModule.forFeature([User, Friend, Conversation, Message]),
    ],
    controllers: [UserController],
    providers: [UserService, ConfigService, Auth0Service],
    exports: [UserService],
})
export class UserModule { }
