import { Friend } from 'src/@app-modules/friend/entities/friend.entity';

/* eslint-disable @typescript-eslint/no-namespace */
export namespace UserNamespace {
  export interface PreparedDataInterface {
    id: string;
    auth0Id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    friends: Friend[];
  }

  export interface ValidatedAuth0UserInterface extends PreparedDataInterface {
    token: Auth0PayloadInterface;
  }

  export interface Auth0PayloadInterface {
    iss: string;
    sub: string;
    aud: string[];
    iat: number;
    exp: number;
    azp: string;
    scope: string;
  }
}
