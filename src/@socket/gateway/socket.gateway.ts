import { HttpException, HttpStatus, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import {
    ConnectedSocket,
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

// @UseGuards(AuthGuard('jwt'))
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
        conversationId: string,
    ): Promise<void> {
        this.logger.log(`Client connected: ${client.id}`);

        this._conversation = await this._conversationService.getConversationById(conversationId);
        this._conversationFriendIds = this._conversation.friend.map((friend) => friend.friend);

        if (!this._conversation) {
            this.handleDisconnect(client);
            throw new HttpException('Conversation not found', HttpStatus.NOT_FOUND);
        }
    }

    public handleDisconnect(
        client: Socket,
    ): void {
        delete this.publicKeys[client.id];
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    public async handleMessage(
        @MessageBody() payload: MessageNamespace.MessageInterface,
    ): Promise<void> {

        const newMessage: MessageNamespace.NewMessageInterface = {
            message: payload.message,
            conversation: this._conversation,
            sender: payload.senderId === this._conversationFriendIds[0].id ? this._conversationFriendIds[0] : this._conversationFriendIds[1],
            createdAt: payload.createdAt,
            updatedAt: payload.updatedAt,
        };

        await this._messageService.createMessage(
            newMessage,
        );
        console.log(payload)
        this.io.emit('message', payload);
    }

    // Handle public key exchange
    @SubscribeMessage('send_public_key')
    public handlePublicKey(
        client: Socket,
        payload: { publicKey: string },
    ): void {
        console.log(`Public key received from ${client.id}: ${payload.publicKey}`);
        this.publicKeys[client.id] = payload.publicKey;
        console.log('publicKeys ----------->', this.publicKeys, '<----------- publicKeys');
        this.io.emit('receive_public_key', { publicKey: payload.publicKey });
    }
}
