import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketGateway } from '../gateway/socket.gateway';

@Injectable()
export class SocketService {
  constructor(private readonly chatGateway: SocketGateway) {
    
  }

  public sendMessage(payload: any) {
    console.log('Sending message:', payload);
    this.chatGateway.io.emit('message', payload);
  }

  // Add more methods for handling events, messages, etc.
}