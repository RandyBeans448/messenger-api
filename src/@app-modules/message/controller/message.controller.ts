import { Controller, UseGuards } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
@ApiTags('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
}
