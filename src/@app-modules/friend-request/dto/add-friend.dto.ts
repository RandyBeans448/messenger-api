import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddFriendDTO {
  @IsNotEmpty()
  @ApiProperty()
  id: string;
}
