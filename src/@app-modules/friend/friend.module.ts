import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from './controller/friend.controller';
import { Friend } from './entities/friend.entity';
import { FriendService } from './services/friend.service';
import { UserService } from '../user/services/user.service';
import { Auth0Service } from 'src/@auth/services/auth0.service';
import { ConfigService } from '@nestjs/config';
import { ConversationService } from '../conversation/services/conversation.service';
import { Conversation } from '../conversation/entities/conversation.entity';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Friend, Conversation, User])],
    controllers: [FriendController],
    providers: [
        ConversationService,
        FriendService,
        ConfigService,
        UserService,
        Auth0Service,
    ],
})
export class FriendModule { }
