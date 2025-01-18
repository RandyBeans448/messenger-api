import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/@app-modules/user/services/user.service';
import * as dotenv from 'dotenv';
import { passportJwtSecret } from 'jwks-rsa';
import { UserNamespace } from 'src/@app-modules/user/interfaces/user.interface';

dotenv.config();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly _logger = new Logger(JwtStrategy.name);

    constructor(private _userService: UserService) {
        super({
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
            }),

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: 'messenger-two',
            issuer: `https://${process.env.AUTH0_ISS}/`,
            algorithms: ['RS256'],
        });
    }

    public async validate(
        payload: UserNamespace.Auth0PayloadInterface,
    ): Promise<UserNamespace.ValidatedAuth0UserInterface> {
        const user: UserNamespace.PreparedDataInterface = await this._userService
            .getUserByAuthId(payload.sub)
            .catch((e) => {
                this._logger.error(`User not found with id ${payload.sub}`);
                this._logger.error(e.message, e.stack);
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            });

        return { token: payload, ...user };
    }
}
