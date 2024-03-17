import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from '../friend/entities/friend.entity';
import { Message } from '../message/entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { ConversationController } from './controller/conversation.controller';
import { ConversationService } from './services/conversation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Friend, Message])],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
