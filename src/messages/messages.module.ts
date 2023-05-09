import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/messages.entity';
import { MessagesRepository } from './messages.repository';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from 'src/auth/users.repository';

@Module({
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Message])],
  providers: [MessagesService, MessagesRepository, UsersRepository],
  controllers: [MessagesController],
  exports: [MessagesRepository],
})
export class MessagesModule {}
