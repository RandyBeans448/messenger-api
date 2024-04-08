// conversation.controller.ts

import { Controller, UseGuards } from '@nestjs/common';
import { ConversationService } from '../services/conversation.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
@ApiTags('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
}
