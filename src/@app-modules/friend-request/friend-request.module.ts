import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestController } from './controller/friend-request.controller';
import { FriendRequestService } from './service/friend-request.service';
import { UserService } from '../user/services/user.service';
import { ConfigService } from '@nestjs/config';
import { Auth0Service } from 'src/@auth/services/auth0.service';
import { FriendRequest } from './entities/friend-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest])],
  controllers: [FriendRequestController],
  providers: [FriendRequestService, ConfigService, UserService, Auth0Service],
})
export class FriendRequestModule {}
