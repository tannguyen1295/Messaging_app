import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@Controller('auth')
export class AuthController {
  private logger = new Logger('UsersController');

  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() userCredentialsDto: UserCredentialsDto): Promise<void> {
    this.logger.log(`Registering user ${userCredentialsDto.username}`);
    return this.authService.register(userCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.logger.log(`Signing user ${userCredentialsDto.username}`);
    return this.authService.signIn(userCredentialsDto);
  }
}
