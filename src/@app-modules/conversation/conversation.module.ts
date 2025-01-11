import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationController } from './controller/conversation.controller';
import { ConversationService } from './services/conversation.service';
import { TranslateModule } from 'src/@utils/translate/translate.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Conversation]),
        TranslateModule,
    ],
    controllers: [ConversationController],
    providers: [ConversationService],
    exports: [ConversationService],
})
export class ConversationModule { }
