import { HttpException, HttpStatus, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
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

    constructor(
        private _conversationService: ConversationService,
        private _messageService: MessageService,
    ) { }

    @WebSocketServer() io: Server;

    public afterInit(server: Server): void {
        this.logger.log('Initialized');
    }

    public async handleConnection(client: Socket, conversationId: string): Promise<void> {
        this.logger.log(`Client connected: ${client.id}`);

        this._conversation = await this._conversationService.getConversationById(conversationId);
        console.log(this._conversation);
        if (!this._conversation) {

            this.handleDisconnect(client);
            throw new HttpException('Conversation not found', HttpStatus.NOT_FOUND);
        }
    }

    public handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    public async handleMessage(payload: any): Promise<void> {
        // console.log('Received message:', payload.message);
        this.io.emit('message', payload);
        // await this._messageService.createMessage(payload.message, this._conversation);
    }
}
