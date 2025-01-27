import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // You need to create this DTO
import { Conversation } from '../entities/conversation.entity';
import { Friend } from 'src/@app-modules/friend/entities/friend.entity';
import { TranslateService } from 'src/@utils/translate/translate.service';
import { LanguageResult } from '@google-cloud/translate/build/src/v2';
import { ConversationNamespace } from '../interfaces/conversation.namespace';

@Injectable()
export class ConversationService {

    private _logger = new Logger(ConversationService.name);

    constructor(
        @InjectRepository(Conversation)
        private readonly _conversationRepository: Repository<Conversation>,
        private _translateService: TranslateService,
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

    public async getConversationById(id: string): Promise<any> {
        try {

            return await this._conversationRepository.findOne({
                where: {
                    id,
                },
                relations: [
                    'friend',
                    'friend.user',
                    'messages',
                    'messages.sender',
                ],
            });
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async getSupportedLanguagesByQuery(searchQuery: string): Promise<LanguageResult[]> {
        try {
            return await this._translateService.getSupportedLanguages(searchQuery);
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async translateMessage(
        message: string,
        language: string,
    ): Promise<ConversationNamespace.TranslatedText> {
        try {
            const text: string = await this._translateService.translateText(
                message,
                language,
            );
   
            return { translatedText: text };
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

    }
}
