import { Controller, Get, HttpException, HttpStatus, Logger, Param, UseGuards } from '@nestjs/common';
import { ConversationService } from '../services/conversation.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Conversation } from '../entities/conversation.entity';

@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
@ApiTags('conversations')
export class ConversationController {

    private _logger = new Logger(ConversationController.name);

    constructor(
        private readonly _conversationService: ConversationService
    ) { }

    @Get('by-user/:id')
    async getConversationByUserId(@Param('id') id: string): Promise<Conversation[]> {
        try {
            return this._conversationService.getConversationsForUser(id);
        } catch (error) {
            this._logger.error(error);
            throw new HttpException(
                'Error getting conversation by user id',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
