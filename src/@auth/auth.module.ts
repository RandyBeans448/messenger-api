import { JwtStrategy } from './strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Auth0Service } from './services/auth0.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/@app-modules/user/user.module';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ConfigModule,
        UserModule,
    ],
    providers: [
        Auth0Service,
        JwtStrategy,
    ],
    exports: [
        Auth0Service,
        JwtStrategy,
    ],
})
export class AuthModule { }
