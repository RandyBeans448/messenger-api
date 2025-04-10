import { FriendRequest } from 'src/@app-modules/friend-request/entities/friend-request.entity';
import { Friend } from 'src/@app-modules/friend/entities/friend.entity';

export namespace UserNamespace {
    export interface LoginUserInterface {
        id: string;
        username: string;
        email: string;
        friend: Friend[];
        friendRequests: FriendRequest[];
        createdAt: Date;
        updatedAt: Date;
    }

    export interface PreparedDataInterface {
        id: string;
        auth0Id: string;
        username: string;
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
