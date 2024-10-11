import { Logger } from '@nestjs/common';
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
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { MessageNamespace } from 'src/@app-modules/message/interfaces/message.interface';
import { MessageService } from 'src/@app-modules/message/services/message.service';
import { User } from 'src/@app-modules/user/entities/user.entity';

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

    constructor(
        private readonly messageService: MessageService,
    ) {}

    @WebSocketServer() private readonly io: Server;

    /**
     * Lifecycle hook: Called after WebSocket server initialization
     */
    public afterInit(server: Server): void {
        this.logger.log('WebSocket server initialized');
    }

    /**
     * Lifecycle hook: Called when a client connects
     * @param client - The connected client socket
     */
    public handleConnection(client: Socket): void {
        this.logger.log(`Client connected: ${client.id}`);
        this.io.emit('join', { clientId: client.id });
    }

    /**
     * Lifecycle hook: Called when a client disconnects
     * @param client - The disconnected client socket
     */
    public handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.io.emit('leave', { clientId: client.id });
    }

    /**
     * Handles incoming chat messages
     * @param payload - The message payload containing conversation details
     */
    @SubscribeMessage('message')
    public async handleMessage(
        @MessageBody() payload: MessageNamespace.MessageInterface,
    ): Promise<void> {
        try {
            const { message, conversation, senderId, createdAt, updatedAt } = payload;

            const sender: User = senderId === conversation.friend[0].id
                ? conversation.friend[0].user
                : conversation.friend[1].user;

            const newMessage: MessageNamespace.NewMessageInterface = {
                message,
                conversation,
                sender,
                createdAt,
                updatedAt,
            };

            await this.messageService.createMessage(newMessage);
            this.io.emit('message', payload);
        } catch (error) {
            this.logger.error('Error handling message', error);
        }
    }

    /**
     * Manually disconnect a client by ID
     * @param clientId - The ID of the client to disconnect
     */
    @SubscribeMessage('disconnectClient')
    public disconnectClient(@MessageBody() clientId: string): void {
        const client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = this.io.sockets.sockets.get(clientId);
        if (client) {
            client.disconnect(true);
            this.logger.log(`Client ${clientId} has been manually disconnected`);
        } else {
            this.logger.warn(`Client ${clientId} not found`);
        }
    }
}
