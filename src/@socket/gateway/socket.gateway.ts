import { Logger, OnApplicationShutdown } from '@nestjs/common';
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
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnApplicationShutdown {
    private readonly _logger = new Logger(SocketGateway.name);

    constructor(private readonly messageService: MessageService) {}

    @WebSocketServer() private readonly io: Server;

    /**
     * Lifecycle hook: Called after WebSocket server initialization
     */
    public afterInit(server: Server): void {
        this._logger.log('WebSocket server initialized');
    }

    /**
     * Lifecycle hook: Called when a client connects
     * @param client - The connected client socket
     */
    public handleConnection(client: Socket): void {
        this._logger.log(`Client connected: ${client.id}`);
        this.io.emit('join', { clientId: client.id });
    }

    /**
     * Lifecycle hook: Called when a client disconnects
     * @param client - The disconnected client socket
     */
    public handleDisconnect(client: Socket): void {
        this._logger.log(`Client disconnected: ${client.id}`);

        client.removeAllListeners();
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
            const { message, conversation, sender, createdAt, updatedAt } = payload;

            const setSender: User = sender.id === conversation.friend[0].user.id
                ? conversation.friend[0].user
                : conversation.friend[1].user;

            const newMessage: MessageNamespace.NewMessageInterface = {
                message: message,
                conversation: conversation,
                sender: setSender,
                createdAt: createdAt,
                updatedAt: updatedAt,
            };

            await this.messageService.createMessage(newMessage);

            this.io.emit('message', payload);
        } catch (error) {
            this._logger.error('Error handling message', error);
        }
    }

    /**
     * Manually disconnect a client by ID
     * @param clientId - The ID of the client to disconnect
     */
    @SubscribeMessage('disconnectClient')
    public disconnectClient(@MessageBody() clientId: string): void {
        const client: Socket = this.io.sockets.sockets.get(clientId);
        if (client) {
            client.disconnect(true);
            this._logger.log(`Client ${clientId} has been manually disconnected`);
        } else {
            this._logger.warn(`Client ${clientId} not found`);
        }
    }

    /**
     * Lifecycle hook: Called when the application is shutting down
     * @param signal - Optional signal for shutdown
     */
    public onApplicationShutdown(signal?: string): void {
        this._logger.log('Shutting down WebSocket server');

        this.io.sockets.sockets.forEach((socket) => {
            socket.disconnect(true);
        });
    }
}
