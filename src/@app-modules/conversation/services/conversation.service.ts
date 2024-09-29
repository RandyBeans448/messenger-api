import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // You need to create this DTO
import { Conversation } from '../entities/conversation.entity';
import { Friend } from 'src/@app-modules/friend/entities/friend.entity';
import { CryptoKeyService } from 'src/@app-modules/crypto-key/services/crypto-key.services';
import { CryptoKeys } from 'src/@app-modules/crypto-key/entities/crypto-key.entity';

@Injectable()
export class ConversationService {
    constructor(
        @InjectRepository(Conversation)
        private readonly _conversationRepository: Repository<Conversation>,
    ) { }

    public async createConversation(friendsForConversation: Friend[]): Promise<Conversation> {
        const conversation: Conversation = new Conversation();
        conversation.friend = friendsForConversation;
  
        try {
            const savedConversation: Conversation = await this._conversationRepository.save(conversation);
            return savedConversation;
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
            return await this._conversationRepository.findOne({
                where: {
                    id,
                },
                relations: ['friend', 'messages'],
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
            return await this._conversationRepository.find({
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
            return await this._conversationRepository.save(conversation);
        } catch(error) {
            console.error('Error updating conversations for user:', error);
            throw new HttpException(
                'Error getting updating conversation',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
