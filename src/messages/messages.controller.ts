import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { GetMessages } from './interface/get-messages.interface';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('/users/:receiver')
  getMessages(@Param('receiver') receiver: string): Promise<GetMessages> {
    return this.messagesService.getMessages(receiver);
  }

  @Post('/users/:receiver')
  sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Param('receiver') receiver: string,
  ): Promise<void> {
    return this.messagesService.createMessage(sendMessageDto, receiver);
  }
}
