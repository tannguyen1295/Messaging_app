import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './messages.entity';
import { MessagesRepository } from './messages.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Message])],
  providers: [MessagesService, MessagesRepository],
  controllers: [MessagesController],
  exports: [MessagesRepository],
})
export class MessagesModule {}
