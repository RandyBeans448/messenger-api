import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @Optional()
  @ApiProperty()
  firstName: string;

  @Optional()
  @ApiProperty()
  lastName: string;

  @Optional()
  @ApiProperty()
  email: string;

  @Optional()
  @IsStrongPassword()
  @ApiProperty()
  password: string;
}
