import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // You need to create this DTO
import { Conversation } from '../entities/conversation.entity';
import { Friend } from 'src/@app-modules/friend/entities/friend.entity';

@Injectable()
export class ConversationService {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,
    ) { }

    public async createConversation(friendsForConversation: Friend[]): Promise<Conversation> {
        const conversation: Conversation = new Conversation();
        conversation.friend = friendsForConversation;
  
        try {
            return await this.conversationRepository.save(conversation);
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw new HttpException(
                'Error creating friendship association',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async getConversationById(id: string): Promise<Conversation> {
        try {
            return await this.conversationRepository.findOne({
                where: {
                    id,
                },
            });
        } catch(error) {
            console.error('Error getting conversation by id:', error);
            throw new HttpException(
                'Error getting conversation by id',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async getConversationsForUser(userId: string): Promise<Conversation[]> {
        try {
            return await this.conversationRepository.find({
                where: {
                    friend: {
                        user: {
                            id: userId,
                        },
                    },
                },
            });
        } catch(error) {
            console.error('Error getting conversations for user:', error);
            throw new HttpException(
                'Error getting conversations for user',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async savedConversation(conversation: Conversation) {
        try {
            return await this.conversationRepository.save(conversation);
        } catch(error) {

            throw new HttpException(
                'Error getting conversation by id',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
