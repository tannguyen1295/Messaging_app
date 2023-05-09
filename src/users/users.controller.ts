import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUsers } from './interface/get-users.interface';
import { UsersService } from './users.service';
import { Logger } from '@nestjs/common';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  private logger = new Logger('UsersController');

  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(): Promise<GetUsers> {
    this.logger.log(`GetUsers endpoint`);
    return this.usersService.getUsers();
  }
}
