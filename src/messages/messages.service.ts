import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesRepository)
    private messagesRepository: MessagesRepository,
  ) {}

  async createMessage(
    sendMessageDto: SendMessageDto,
    receiver: string,
  ): Promise<void> {
    return this.messagesRepository.createMessage(sendMessageDto, receiver);
  }
}
