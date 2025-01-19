import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { MessageNamespace } from '../interfaces/message.interface';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) { }

    public async createMessage(
        payload: MessageNamespace.NewMessageInterface,
    ): Promise<Message> {

        const newMessage: Message = new Message();
        newMessage.message = payload.message;
        newMessage.conversation = payload.conversation;
        newMessage.sender = payload.sender;

        try {
            return await this.messageRepository.save(newMessage);
        } catch (error: any) {
            console.error('Error creating message:', error);
            throw new HttpException(
                'Error creating message',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
