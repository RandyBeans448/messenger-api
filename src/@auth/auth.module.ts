import { JwtStrategy } from './strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Auth0Service } from './services/auth0.service';
import { PassportModule } from '@nestjs/passport';
import { UserService } from 'src/@app-modules/user/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/@app-modules/conversation/entities/conversation.entity';
import { Friend } from 'src/@app-modules/friend/entities/friend.entity';
import { Message } from 'src/@app-modules/message/entities/message.entity';
import { User } from 'src/@app-modules/user/entities/user.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    TypeOrmModule.forFeature([User, Friend, Conversation, Message]),
  ],
  providers: [Auth0Service, JwtStrategy, UserService],
  exports: [Auth0Service, JwtStrategy],
})
export class AuthModule {}
