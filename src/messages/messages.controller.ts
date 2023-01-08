import { Body, Controller, Param, Post } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post('/users/:receiver')
  sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Param('receiver') receiver: string,
  ): Promise<void> {
    return this.messagesService.createMessage(sendMessageDto, receiver);
  }
}
