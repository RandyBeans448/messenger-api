import { startCase } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import {
  ManagementClient,
  ManagementClientOptionsWithClientCredentials,
  UserCreate,
} from 'auth0';
import * as passGenerator from 'generate-password';

@Injectable()
export class Auth0Service {
  private auth0: ManagementClient;
  private readonly _logger = new Logger(Auth0Service.name);

  constructor(private _config: ConfigService) {
    this._logger.log('Setting up Auth0 Management');
    this._init();
  }

  private _init() {
    this.auth0 = new ManagementClient({
      domain: this._config.get('AUTH0_DOMAIN'),
      clientId: this._config.get('AUTH0_CLIENT_ID'),
      clientSecret: this._config.get('AUTH0_CLIENT_SECRET'),
      // scope: 'read:users update:users create:users delete:users'
    } as ManagementClientOptionsWithClientCredentials);
  }

  // public async updateUserPassword(
  //   userAuth0Id: string,
  // ): Promise<PasswordChangeTicketResponse> {
  //   // return this.auth0.createPasswordChangeTicket({
  //   //   user_id: userAuth0Id,
  //   //   client_id: this._config.get('AUTH0_CLIENT_ID'),
  //   // });

  //   return await this.auth0.tickets.changePassword({
  //     user_id: userAuth0Id,
  //     result_url: 'YOUR_RESET_PASSWORD_REDIRECT_URL',
  //     connection_id: 'YOUR_CONNECTION_ID',
  //   });
  // }

  public async createUser(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    auth0Options: { verifyEmail: boolean } = { verifyEmail: true },
  ): Promise<any> {
    this._logger.log('Creating New Auth User');

    const userObj: UserCreate = {
      email: email,
      name: startCase(`${firstName} ${lastName}`),
      family_name: startCase(lastName),
      given_name: startCase(firstName),
      password,
      verify_email: auth0Options.verifyEmail,
      connection: 'Username-Password-Authentication',
    };

    // If no password is set then generate one
    if (!password) {
      userObj.password = passGenerator.generate({
        length: 10,
        symbols: true,
        numbers: true,
      });
    }

    const user = await this.auth0.users.create(userObj).catch((e) => {
      this._logger.error(e.message, e.stack);
      throw new Error(e.message);
    });

    return user;
  }

  // public async updateUser(
  //   auth0Id: string,
  //   updateUserValues: UpdateUserInterface,
  //   auth0Options: { verifyEmail: boolean } = { verifyEmail: true },
  // ): Promise<User<AppMetadata, UserMetadata>> {
  //   this._logger.log('Updating exsisting Auth User');

  //   const auth0Object: ObjectWithId = {
  //     id: auth0Id,
  //   };

  //   if (updateUserValues.password) {
  //     const userPasswordObj: UserData = {
  //       password: updateUserValues?.password,
  //     };

  //     await this.auth0.updateUser(auth0Object, userPasswordObj).catch((e) => {
  //       this._logger.error(e.message, e.stack);
  //       throw new Error(e.message);
  //     });
  //   }

  //   const userObj: UserData = {
  //     email: updateUserValues?.email,
  //     name: startCase(
  //       `${updateUserValues?.firstName} ${updateUserValues?.lastName}`,
  //     ),
  //     family_name: startCase(updateUserValues?.firstName),
  //     given_name: startCase(updateUserValues?.lastName),
  //     nickname: `${updateUserValues?.firstName.toLowerCase()}${updateUserValues?.lastName.toLowerCase()}`,
  //     verify_email: auth0Options.verifyEmail,
  //   };

  //   const user: User<AppMetadata, UserMetadata> = await this.auth0
  //     .updateUser(auth0Object, userObj)
  //     .catch((e) => {
  //       this._logger.error(e.message, e.stack);
  //       throw new Error(e.message);
  //     });

  //   return user;
  // }

  // public async removeUser(userId: string): Promise<void> {
  //   this._logger.log(`Removing User from Auth0 ${userId}`);

  //   try {
  //     // TODO - Jack & Herby - Check why deleteUser method does nothing
  //     await this.auth0.deleteUser({
  //       id: userId,
  //     });
  //   } catch (e) {
  //     this._logger.error(e.message, e.stack);
  //     throw new Error(`User with ID ${userId} was NOT removed from Auth0`);
  //   }
  // }
}
