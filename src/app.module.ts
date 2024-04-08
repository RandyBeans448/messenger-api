// app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configValidationSchema } from './config.schema';
import { ConversationModule } from './@app-modules/conversation/conversation.module';
import { FriendModule } from './@app-modules/friend/friend.module';
import { MessageModule } from './@app-modules/message/message.module';
import { UserModule } from './@app-modules/user/user.module';
import { DatabaseModule } from './@database/database.module';
import { AuthModule } from './@auth/auth.module';
import { UiEnvModule } from './@core/ui-env/ui-env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      validationSchema: configValidationSchema,
    }),
    AuthModule,
    UiEnvModule,
    DatabaseModule,
    UserModule,
    FriendModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
