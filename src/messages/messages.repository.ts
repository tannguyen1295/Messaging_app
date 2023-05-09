import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../auth/users.repository';
import { DataSource, Repository } from 'typeorm';
import { SendMessageDto } from './dto/send-message.dto';
import { Message } from './entity/messages.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class MessagesRepository extends Repository<Message> {
  private logger = new Logger('MessagesRepository');

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

    this.logger.verbose(
      `Checking the existence of the receiver ${receiver} and the sender ${sender}`,
    );

    const senderExisting = await this.usersRepository.findOneBy({
      username: sender,
    });
    const receiverExisting = await this.usersRepository.findOneBy({
      username: receiver,
    });

    if (!senderExisting || !receiverExisting) {
      this.logger.error(`Either receiver of sender does not exist`);
      throw new NotFoundException('Either sender or receiver cannot be found');
    }

    // create message to database
    this.logger.verbose(`Saving message to the database`);
    const message = this.create({
      message: content,
      sender: senderExisting,
      receiver: receiverExisting,
    });

    await this.save(message);
  }
}
