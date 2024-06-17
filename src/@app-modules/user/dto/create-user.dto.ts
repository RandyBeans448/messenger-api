import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @Optional()
  @ApiProperty()
  firstName: string;

  @Optional()
  @ApiProperty()
  lastName: string;

  @Optional()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
