import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from './controller/friend.controller';
import { Friend } from './entities/friend.entity';
import { FriendService } from './services/friend.service';
import { UserModule } from '../user/user.module';
import { ConversationModule } from '../conversation/conversation.module';
import { CryptoKeyModule } from '../crypto-key/crypto-key.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Friend,
        ]),
        ConversationModule,
        UserModule,
        CryptoKeyModule,
    ],
    controllers: [FriendController],
    providers: [
        FriendService,
    ],
    exports: [
        FriendService,
    ]
})
export class FriendModule { }
