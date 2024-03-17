import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from '../conversation/entities/conversation.entity';
import { User } from '../user/entities/user.entity';
import { MessageController } from './controller/message.controller';
import { MessageService } from './services/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation, User])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
