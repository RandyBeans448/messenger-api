import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // You need to create this DTO
import { Conversation } from '../entities/conversation.entity';
import { Friend } from 'src/@app-modules/friend/entities/friend.entity';

@Injectable()
export class ConversationService {

    private _logger = new Logger(ConversationService.name);

    constructor(
        @InjectRepository(Conversation)
        private readonly _conversationRepository: Repository<Conversation>,
    ) { }

    public async createConversation(friendsForConversation: Friend[]): Promise<Conversation> {
        const conversation: Conversation = new Conversation();
        conversation.friend = friendsForConversation;
  
        try {
            return await this._conversationRepository.save(conversation);
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
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
                relations: [
                    'friend', 
                    'friend.cryptoKey',
                    'friend.user',
                    'messages',
                    'messages.sender',
                ],
            });
        } catch(error) {
            this._logger.error(error);
            throw new HttpException(
                error,
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
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async savedConversation(conversation: Conversation): Promise<Conversation> {
        try {
            return await this._conversationRepository.save(conversation);
        } catch(error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
