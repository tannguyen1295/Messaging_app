import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { GetUsers } from './interface/get-users.interface';
import { MessagesRepository } from '../messages/messages.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => UsersRepository))
    private usersRepository: UsersRepository,

    @Inject(forwardRef(() => MessagesRepository))
    private messagesRepository: MessagesRepository,

    private jwtService: JwtService,
  ) {}

  async register(userCredentialsDto: UserCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(userCredentialsDto);
  }

  async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = userCredentialsDto;
    const user = this.usersRepository.findOneBy({ username: username });

    // compare password and issue jwt
    if (user && (await bcrypt.compare(password, (await user).password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials.');
    }
  }

  async getUsers(): Promise<GetUsers> {
    let results = [];

    // Get All Users
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .select(['DISTINCT(user.username), user.id'])
      .getRawMany();

    // Get the latest message for each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const latestMessage = await this.messagesRepository
        .createQueryBuilder('message')
        .select('message.createdDate')
        .where('message.sender = :senderId', {
          senderId: user.id,
        })
        .orderBy('message.createdDate', 'DESC')
        .getRawOne();

      const difference =
        new Date().getTime() -
        new Date(latestMessage.message_createdDate).getTime();

      results.push({
        username: user.username,
        available: Math.round(difference / 1000 / 60) <= 10 ? true : false,
      });
    }

    return { users: results };
  }
}
