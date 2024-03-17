import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from '../conversation/entities/conversation.entity';
import { User } from '../user/entities/user.entity';
import { FriendController } from './controller/friend.controller';
import { Friend } from './entities/friend.entity';
import { FriendService } from './services/friend.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User, Conversation])],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
