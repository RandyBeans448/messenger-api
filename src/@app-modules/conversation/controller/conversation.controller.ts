// conversation.controller.ts

import { Controller } from '@nestjs/common';
import { ConversationService } from '../services/conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
}
