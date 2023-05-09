import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MessagesModule } from 'src/messages/messages.module';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from 'src/auth/users.repository';
import { MessagesRepository } from 'src/messages/messages.repository';

@Module({
  imports: [ConfigModule, forwardRef(() => MessagesModule)],
  providers: [UsersService, UsersRepository, MessagesRepository],
  controllers: [UsersController],
})
export class UsersModule {}
