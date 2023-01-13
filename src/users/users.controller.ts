import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { GetUsers } from './interface/get-users.interface';
import { UsersService } from './users.service';
import { Logger } from '@nestjs/common';

@Controller('users')
export class UsersController {
  private logger = new Logger('UsersController');

  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard())
  getUsers(): Promise<GetUsers> {
    this.logger.log(`GetUsers endpoint`);
    return this.usersService.getUsers();
  }

  @Post('/register')
  register(@Body() userCredentialsDto: UserCredentialsDto): Promise<void> {
    this.logger.log(`Registering user ${userCredentialsDto.username}`);
    return this.usersService.register(userCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.logger.log(`Signing user ${userCredentialsDto.username}`);
    return this.usersService.signIn(userCredentialsDto);
  }
}
