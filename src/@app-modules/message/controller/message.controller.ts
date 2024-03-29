import { Controller } from '@nestjs/common';
import { MessageService } from '../services/message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
}
