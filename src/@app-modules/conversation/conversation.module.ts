import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationController } from './controller/conversation.controller';
import { ConversationService } from './services/conversation.service';

@Module({
    imports: [TypeOrmModule.forFeature([Conversation])],
    controllers: [ConversationController],
    providers: [ConversationService],
    exports: [ConversationService],
})
export class ConversationModule { }
