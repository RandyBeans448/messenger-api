import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoKeyController } from './controller/crypto-key.controller';
import { CryptoKeyService } from './services/crypto-key.services';
import { CryptoKeys } from './entities/crypto-key.entity';
import { FriendModule } from '../friend/friend.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CryptoKeys]),
    ],
    providers: [CryptoKeyService],
    controllers: [CryptoKeyController],
    exports: [CryptoKeyService],
})
export class CryptoKeyModule { }
