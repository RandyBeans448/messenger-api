import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

import {
    ApiResponse,
    GetUsers200ResponseOneOfInner,
    ManagementClient,
    ManagementClientOptionsWithClientCredentials,
    PostPasswordChange201Response,
    UserCreate,
} from 'auth0';

@Injectable()
export class Auth0Service {
    private auth0: ManagementClient;
    private readonly _logger = new Logger(Auth0Service.name);

    constructor(private _config: ConfigService) {
        this._logger.log('Setting up Auth0 Management');
        this._init();
    }

    private _init(): void {
        this.auth0 = new ManagementClient({
            domain: this._config.get('AUTH0_DOMAIN'),
            clientId: this._config.get('AUTH0_CLIENT_ID'),
            clientSecret: this._config.get('AUTH0_CLIENT_SECRET'),
            scope: 'read:users update:users create:users delete:users',
        } as ManagementClientOptionsWithClientCredentials);
    }

    public async createUser(
        email: string,
        username: string,
    ): Promise<any> {

        this._logger.log('Creating New Auth User');

        const userObj: UserCreate = {
            email: email,
            username: username,
            verify_email: false,
            connection: 'Username-Password-Authentication',
        };
        return await this._createUser(userObj);
    }

    public async updateUserPassword(
        userAuth0Id: string,
    ): Promise<ApiResponse<PostPasswordChange201Response>> {
        return await this.auth0.tickets.changePassword({
            user_id: userAuth0Id,
            result_url: 'YOUR_RESET_PASSWORD_REDIRECT_URL',
            connection_id: 'YOUR_CONNECTION_ID',
        });
    }

    public async removeUser(userId: string): Promise<void> {
        this._logger.log(`Removing User from Auth0 ${userId}`);
        try {
            await this.auth0.users.delete({
                id: userId,
            });
        } catch (e) {
            this._logger.error(e.message, e.stack);
            throw new Error(`User with ID ${userId} was NOT removed from Auth0`);
        }
    }

    private async _createUser(
        userObj,
    ): Promise<ApiResponse<GetUsers200ResponseOneOfInner>> {
        try {
            return await this.auth0.users.create(userObj);
        } catch (e) {
            this._logger.error(e.message, e.stack);
            console.log(e)
            throw e;
        }
    }
}
