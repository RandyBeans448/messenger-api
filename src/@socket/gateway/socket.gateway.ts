import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Conversation } from 'src/@app-modules/conversation/entities/conversation.entity';
import { ConversationService } from 'src/@app-modules/conversation/services/conversation.service';
import { MessageNamespace } from 'src/@app-modules/message/interfaces/message.interface';
import { MessageService } from 'src/@app-modules/message/services/message.service';

@WebSocketGateway({
    namespace: 'chatroom',
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(SocketGateway.name);

    private _conversation: Conversation;
    private _conversationFriendIds: any[];
    private publicKeys: { [socketId: string]: string } = {};

    constructor(
        private _conversationService: ConversationService,
        private _messageService: MessageService,
    ) { }

    @WebSocketServer() io: Server;

    public afterInit(server: Server): void {
        this.logger.log('Initialized');
    }

    @SubscribeMessage('join')
    public async handleConnection(
        client: Socket,
    ): Promise<void> {
        this.logger.log(`Client connected: ${client.id}`);
        this.io.emit('join');
    }

    public handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    public async handleMessage(
        @MessageBody() payload: MessageNamespace.MessageInterface,
    ): Promise<void> {

        const newMessage: MessageNamespace.NewMessageInterface = {
            message: payload.message,
            conversation: payload.conversation,
            sender: payload.senderId === payload.conversation.friend[0].id ? payload.conversation.friend[0].user : payload.conversation.friend[1].user,
            createdAt: payload.createdAt,
            updatedAt: payload.updatedAt,
        };

        await this._messageService.createMessage(
            newMessage,
        );

        this.io.emit('message', payload);
    }

    @SubscribeMessage('disconnectClient')
    disconnectClient(@MessageBody() clientId: string): void {
    //   const clientSocket = this.io.sockets.sockets.get(clientId);
    //   if (clientSocket) {
        // clientSocket.disconnect();
        this._conversation = null;
        this._conversationFriendIds = null;
        console.log(`Client ${clientId} has been disconnected`);
    //   }
    }
}
