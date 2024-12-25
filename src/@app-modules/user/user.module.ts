import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { Auth0Service } from 'src/@auth/services/auth0.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ConfigModule,
    ],
    controllers: [UserController],
    providers: [
        UserService,
        Auth0Service,
    ],
    exports: [UserService],
})
export class UserModule { }
