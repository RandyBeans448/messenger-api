import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ConversationService } from '../services/conversation.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Conversation } from '../entities/conversation.entity';
import { GetLanguageForTranslationDTO } from '../dto/get-language-for-translation.dto';
import { TranslateMessageDTO } from '../dto/translate-conversation.dto';
import { ConversationNamespace } from '../interfaces/conversation.namespace';

@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
@ApiTags('conversations')
export class ConversationController {

    private _logger = new Logger(ConversationController.name);

    constructor(
        private readonly _conversationService: ConversationService
    ) { }

    @Get(':id')
    async getConversationById(@Param('id') id: string): Promise<Conversation> {
        try {
            return this._conversationService.getConversationById(id);
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('by-user/:id')
    async getConversationByUserId(@Param('id') id: string): Promise<Conversation[]> {
        try {
            return this._conversationService.getConversationsForUser(id);
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('find-language')
    public async findLanguage(@Body() body: GetLanguageForTranslationDTO): Promise<any> {
        try {
            return await this._conversationService.getSupportedLanguagesByQuery(body.searchQuery);
        } catch (error: any) {
            this._logger.error(error);
            throw new HttpException('There has been an error with this Google API request.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('translate')
    public async translate(@Body() body: TranslateMessageDTO): Promise<ConversationNamespace.TranslatedText> {
        try {
            return await this._conversationService.translateMessage(
                body.message,
                body.language,
            );
        } catch (error: any) {
            this._logger.error(error);
        }
    }
}
