import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('create-new-user')
  async createUser(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<Partial<User>> {
    return this._userService.createUser(createUserDTO);
  }
}
