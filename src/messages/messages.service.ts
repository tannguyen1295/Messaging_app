import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { SendMessageDto } from './dto/send-message.dto';
import { GetMessages } from './interface/get-messages.interface';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(forwardRef(() => MessagesRepository))
    private messagesRepository: MessagesRepository,

    // @InjectRepository(UsersRepository)
    // private usersRepository: UsersRepository,

    @Inject(forwardRef(() => UsersRepository))
    private usersRepository: UsersRepository,
  ) {}

  async getMessages(receiver: string): Promise<GetMessages> {
    let results = [];

    // validate if receiver exists
    const receiverExisting = await this.usersRepository.findOneBy({
      username: receiver,
    });

    if (!receiverExisting) {
      throw new NotFoundException(`User "${receiver}" cannot be found`);
    }

    // retrieve messages
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
