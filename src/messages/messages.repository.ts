import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { DataSource, EntityRepository, Repository } from 'typeorm';
import { SendMessageDto } from './dto/send-message.dto';
import { Message } from './messages.entity';

@EntityRepository(Message)
@Injectable()
export class MessagesRepository extends Repository<Message> {
  constructor(
    private dataSrouce: DataSource,
    private usersRepository: UsersRepository,
  ) {
    super(Message, dataSrouce.createEntityManager());
  }

  async createMessage(
    sendMessageDto: SendMessageDto,
    receiver: string,
  ): Promise<void> {
    // validate sender and receiver exist
    const { sender, content } = sendMessageDto;

    const senderExisting = await this.usersRepository.findOneBy({
      username: sender,
    });
    const receiverExisting = await this.usersRepository.findOneBy({
      username: receiver,
    });

    if (!senderExisting || !receiverExisting) {
      throw new NotFoundException('Either sender or receiver cannot be found');
    }

    // create message to database
    const message = this.create({
      message: content,
      sender: senderExisting,
      receiver: receiverExisting,
    });

    await this.save(message);
  }
}
