import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../auth/users.repository';
import { SendMessageDto } from './dto/send-message.dto';
import { GetMessages } from './interface/get-messages.interface';
import { MessagesRepository } from './messages.repository';
import { Logger } from '@nestjs/common';

@Injectable()
export class MessagesService {
  private logger = new Logger('MessagesService');

  constructor(
    @Inject(forwardRef(() => MessagesRepository))
    private messagesRepository: MessagesRepository,

    @Inject(forwardRef(() => UsersRepository))
    private usersRepository: UsersRepository,
  ) {}

  async getMessages(receiver: string): Promise<GetMessages> {
    const results = [];

    // validate if receiver exists
    this.logger.verbose(`Checking the existence of the receiver ${receiver}`);
    const receiverExisting = await this.usersRepository.findOneBy({
      username: receiver,
    });

    if (!receiverExisting) {
      this.logger.error(`${receiver} does not exist`);
      throw new NotFoundException(`User "${receiver}" cannot be found`);
    }

    // retrieve messages
    this.logger.verbose(
      `Retrieving messages with the receiver being ${receiver}`,
    );
    const values = await this.messagesRepository
      .createQueryBuilder('messages')
      .select(['user.username', 'messages.message', 'messages.createdDate'])
      .innerJoin('messages.sender', 'user')
      .where('messages.receiver = :receiverId', {
        receiverId: receiverExisting.id,
      })
      .orderBy('messages.createdDate', 'DESC')
      .getMany();

    // add messages to results and return
    this.logger.verbose(`Formulating the result`);
    values.forEach((value) => {
      results.push({
        message: value.message,
        date: value.createdDate.toISOString(),
        sender: value.sender.username,
      });
    });

    return { messages: results };
  }

  async createMessage(
    sendMessageDto: SendMessageDto,
    receiver: string,
  ): Promise<void> {
    return this.messagesRepository.createMessage(sendMessageDto, receiver);
  }
}
