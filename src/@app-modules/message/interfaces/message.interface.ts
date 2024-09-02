import { Conversation } from "src/@app-modules/conversation/entities/conversation.entity";
import { User } from "src/@app-modules/user/entities/user.entity";

export namespace MessageNamespace {

    export interface MessageInterface {
        message: string;
        senderId: string;
        createdAt: string;
        updatedAt: string;
    }

    export interface NewMessageInterface {
        message: string;
        conversation: Conversation;
        sender: User;
        createdAt: string;
        updatedAt: string;
    }
}