import { Logger, OnApplicationShutdown } from '@nestjs/common';
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageNamespace } from 'src/@app-modules/message/interfaces/message.interface';
import { MessageService } from 'src/@app-modules/message/services/message.service';
import { User } from 'src/@app-modules/user/entities/user.entity';

@WebSocketGateway({
    namespace: 'chatroom',
    cors: {
        origin: ['http://localhost:4200'],
        methods: ['GET', 'POST'],
        credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
    cookie: true,
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnApplicationShutdown {
    private readonly _logger = new Logger(SocketGateway.name);
    private readonly connectedClients = new Map<string, Socket>();

    constructor(private readonly messageService: MessageService) {}

    @WebSocketServer() private readonly io: Server;

    public afterInit(server: Server): void {
        this._logger.log('WebSocket server initialized');
        
        // Set up error handling for the server
        this.io.on('connect_error', (err) => {
            this._logger.error(`Connection error: ${err.message}`);
        });

        this.io.on('error', (err) => {
            this._logger.error(`Socket server error: ${err.message}`);
        });
    }

    public async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
        try {
            const conversationId = client.handshake.query.conversationId as string;
            if (!conversationId) {
                client.disconnect(true);
                return;
            }

            this.connectedClients.set(client.id, client);
            await client.join(conversationId);
            
            this._logger.log(`Client connected: ${client.id} to conversation: ${conversationId}`);
            
            this.io.to(conversationId).emit('join', { 
                clientId: client.id,
                timestamp: new Date().toISOString()
            });

            // Set up error handling for individual client
            client.on('error', (error) => {
                this._logger.error(`Error from client ${client.id}:`, error);
            });

        } catch (error) {
            this._logger.error(`Connection error for client ${client.id}:`, error);
            client.disconnect(true);
        }
    }

    public handleDisconnect(@ConnectedSocket() client: Socket): void {
        try {
            const conversationId = client.handshake.query.conversationId as string;
            
            this.connectedClients.delete(client.id);
            client.removeAllListeners();
            
            if (conversationId) {
                this.io.to(conversationId).emit('leave', { 
                    clientId: client.id,
                    timestamp: new Date().toISOString()
                });
            }

            this._logger.log(`Client disconnected: ${client.id}`);
        } catch (error) {
            this._logger.error(`Disconnect error for client ${client.id}:`, error);
        }
    }

    @SubscribeMessage('message')
    public async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: MessageNamespace.MessageInterface,
    ): Promise<void> {
        try {
            const { message, conversation, sender, createdAt, updatedAt } = payload;

            if (!message || !conversation || !sender) {
                throw new Error('Invalid message payload');
            }

            const setSender: User = sender.id === conversation.friend[0].user.id
                ? conversation.friend[0].user
                : conversation.friend[1].user;

            const newMessage: MessageNamespace.NewMessageInterface = {
                message,
                conversation,
                sender: setSender,
                createdAt,
                updatedAt,
            };

            await this.messageService.createMessage(newMessage);

            this.io.to(conversation.id).emit('message', {
                ...payload,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            this._logger.error(`Error handling message from client ${client.id}:`, error);
            client.emit('error', { message: 'Failed to process message' });
        }
    }

    public onApplicationShutdown(signal?: string): void {
        this._logger.log(`Shutting down WebSocket server (signal: ${signal})`);

        this.connectedClients.forEach((socket, id) => {
            try {
                socket.emit('shutdown', { message: 'Server shutting down' });
                socket.disconnect(true);
            } catch (error) {
                this._logger.error(`Error disconnecting client ${id}:`, error);
            }
        });

        this.connectedClients.clear();
    }
}