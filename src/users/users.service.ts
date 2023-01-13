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
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

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

    this.logger.verbose(`Getting user ${username} from the database`);
    const user = this.usersRepository.findOneBy({ username: username });

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

  async getUsers(): Promise<GetUsers> {
    let results = [];

    // Get All Users
    this.logger.verbose(`Getting all users from the database`);
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .select(['DISTINCT(user.username), user.id'])
      .getRawMany();

    // Get the latest message for each user
    this.logger.verbose(`Getting the latest message for each user`);
    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      // Last message sent by the user
      this.logger.debug(`Getting the latest message for user "${user.id}"`);
      const latestMessage = await this.messagesRepository
        .createQueryBuilder('message')
        .select('message.createdDate')
        .where('message.sender = :senderId', {
          senderId: user.id,
        })
        .orderBy('message.createdDate', 'DESC')
        .getRawOne();

      // Calculate how far the last message is sent to the present
      const howFarIsLastMessageInMinute = Math.round(
        (new Date().getTime() -
          new Date(latestMessage.message_createdDate).getTime()) /
          1000 /
          60,
      );
      this.logger.debug(
        `Latest message in minutes compared to the present "${howFarIsLastMessageInMinute}"`
      );

      // Add user's username and his/her availability to results and return
      results.push({
        username: user.username,
        available: howFarIsLastMessageInMinute <= 10 ? true : false,
      });
    }

    return { users: results };
  }
}
