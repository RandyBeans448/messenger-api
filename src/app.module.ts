// app.module.ts

import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { ConversationModule } from './@app-modules/conversation/conversation.module';
import { FriendModule } from './@app-modules/friend/friend.module';
import { MessageModule } from './@app-modules/message/message.module';
import { UserModule } from './@app-modules/user/user.module';
import { DatabaseModule } from './@database/database.module';
import { AuthModule } from './@auth/auth.module';
import { UiEnvModule } from './@core/ui-env/ui-env.module';
import { AppController } from './app.controller';
import { JsonBodyMiddleware } from './@utils/middleware/json-body.middleware';
import { RawBodyMiddleware } from './@utils/middleware/raw-body.middleware';
import { FriendRequestModule } from './@app-modules/friend-request/friend-request.module';
import { SocketModule } from './@socket/socket.module';
import { CryptoKeyModule } from './@app-modules/crypto-key/crypto-key.module';
import { TranslateModule } from './@utils/translate/translate.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env`],
            validationSchema: configValidationSchema,
        }),
        AuthModule,
        UiEnvModule,
        DatabaseModule,
        ConversationModule,
        UserModule,
        FriendModule,
        FriendRequestModule,
        MessageModule,
        // SocketModule,
        CryptoKeyModule,
        TranslateModule,
    ],
    controllers: [AppController],
    providers: [Logger],
})
export class AppModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(RawBodyMiddleware)
            .forRoutes('*')
            .apply(JsonBodyMiddleware)
            .forRoutes('*');
    }
}
