import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../auth/users.repository';
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
  ) {}

  async getUsers(): Promise<GetUsers> {
    const results = [];

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
        .createQueryBuilder('messages')
        .select('messages.createdDate')
        .where('messages.sender = :senderId', {
          senderId: user.id,
        })
        .orderBy('messages.createdDate', 'DESC')
        .getRawOne();

      // Calculate how far the last message is sent to the present
      const howFarIsLastMessageInMinute = Math.round(
        (new Date().getTime() -
          new Date(latestMessage.message_createdDate).getTime()) /
          1000 /
          60,
      );
      this.logger.debug(
        `Latest message in minutes compared to the present "${howFarIsLastMessageInMinute}"`,
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
