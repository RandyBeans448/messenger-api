import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { Conversation } from 'src/@app-modules/conversation/entities/conversation.entity';
import { Message } from 'src/@app-modules/message/entities/message.entity';
import { Repository } from 'typeorm';

@WebSocketGateway(8000, { 
    namespace: 'events',
    cors: {
        origin: process.env.CORS_WHITELIST,
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(ChatGateway.name);

    constructor(
        @InjectRepository(Conversation)
        private _conversationRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private _messageRepository: Repository<Message>,
    ) { }

    @WebSocketServer() io: Server;

    public afterInit() {
        this.logger.log('Initialized');
    }

    public handleConnection(client: any, ..._args: any[]) {
        const { sockets } = this.io.sockets;

        this.logger.log(`Client id: ${client.id} connected`);
        this.logger.debug(`Number of connected clients: ${sockets.size}`);
    }

    public handleDisconnect(client: any) {
        this.logger.log(`Client id:${client.id} disconnected`);
    }

    @SubscribeMessage('message')
    public handleMessage(client: any, data: any) {
        console.log(data);
        this.logger.log(`Message received from client id: ${client.id}`);
        this.logger.debug(`Payload: ${data}`);
        return {
            event: 'pong',
            data: 'Wrong data that will make the test fail',
        };
    }
}
