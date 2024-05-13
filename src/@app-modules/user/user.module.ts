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
import { FriendRequest } from '../friend-request/entities/friend-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Friend,
      Conversation,
      Message,
      FriendRequest,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, ConfigService, Auth0Service],
  exports: [UserService],
})
export class UserModule {}
