import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { SocketGateway } from "./gateway/socket.gateway";
import { SocketService } from "./service/socket.service";
import { CryptoKeyModule } from "src/@app-modules/crypto-key/crypto-key.module";
import { MessageModule } from "src/@app-modules/message/message.module";
import { ConversationModule } from "src/@app-modules/conversation/conversation.module";

@Module({
    imports: [
        CryptoKeyModule,
        MessageModule,
        ConversationModule,
    ],
    controllers: [],
    providers: [
        SocketGateway,
        SocketService,
    ],
    exports: [],
})
export class SocketModule { }