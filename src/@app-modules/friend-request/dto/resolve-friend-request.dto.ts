import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResolveFriendRequestDTO {
  @IsNotEmpty()
  @ApiProperty()
  friendRequestId: string;

  @IsNotEmpty()
  @ApiProperty()
  response: boolean;
}
