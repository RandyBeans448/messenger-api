import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { SocketGateway } from "./gateway/socket.gateway";
import { SocketService } from "./service/socket.service";
import { MessageService } from "src/@app-modules/message/services/message.service";
import { ConversationService } from "src/@app-modules/conversation/services/conversation.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Conversation } from "src/@app-modules/conversation/entities/conversation.entity";
import { Message } from "src/@app-modules/message/entities/message.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                Conversation,
                Message,
            ]
        ),
    ],
    controllers: [],
    providers: [SocketGateway, SocketService, MessageService, ConversationService],
    exports: [],
})
export class SocketModule { }