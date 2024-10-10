import { Conversation } from "src/@app-modules/conversation/entities/conversation.entity";
import { User } from "src/@app-modules/user/entities/user.entity";

export namespace MessageNamespace {

    export interface MessageInterface {
        message: string;
        senderId: string;
        conversation: Conversation;
        createdAt: string;
        updatedAt: string;
    }

    export interface NewMessageInterface {
        message: string;
        sender: User;
        conversation: Conversation;
        createdAt: string;
        updatedAt: string;
    }
}