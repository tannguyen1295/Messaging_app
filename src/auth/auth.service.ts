import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from './users.repository';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @Inject(forwardRef(() => UsersRepository))
    private usersRepository: UsersRepository,

    private jwtService: JwtService,
  ) {}

  async register(userCredentialsDto: UserCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(userCredentialsDto);
  }

  async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = userCredentialsDto;

    this.logger.verbose(`Getting user ${username} from the database`);
    const user = this.usersRepository.findOneBy({ username: username });
    this.logger.verbose(await user);

    // compare password and issue jwt
    this.logger.verbose(`Authorizing user ${username}`);
    if (user && (await bcrypt.compare(password, (await user).password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      this.logger.error(`Wrong credentials for user ${username}`);
      throw new UnauthorizedException('Please check your login credentials.');
    }
  }
}
