import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SendMessageDto } from './dto/send-message.dto';
import { GetMessages } from './interface/get-messages.interface';
import { MessagesService } from './messages.service';
import { Logger } from '@nestjs/common';

@Controller('messages')
@UseGuards(AuthGuard())
export class MessagesController {
  private logger = new Logger('MessagesController');

  constructor(private messagesService: MessagesService) {}

  @Get('/users/:receiver')
  getMessages(@Param('receiver') receiver: string): Promise<GetMessages> {
    this.logger.log(`GetMessages for the receiver ${receiver}`);
    return this.messagesService.getMessages(receiver);
  }

  @Post('/users/:receiver')
  sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Param('receiver') receiver: string,
  ): Promise<void> {
    this.logger.log(`PostMessages for the receiver ${receiver}`);
    return this.messagesService.createMessage(sendMessageDto, receiver);
  }
}
