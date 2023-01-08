import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { GetUsers } from './interface/get-users.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(): Promise<GetUsers> {
    return this.usersService.getUsers();
  }

  @Post('/register')
  register(@Body() userCredentialsDto: UserCredentialsDto): Promise<void> {
    return this.usersService.register(userCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.usersService.signIn(userCredentialsDto);
  }
}
