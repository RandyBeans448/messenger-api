import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('Index')
export class AppController {
  @Get('')
  public index() {
    return 'alive';
  }
}
