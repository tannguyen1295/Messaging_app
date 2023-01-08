import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: 300,
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UsersService, UsersRepository, JwtStategy],
  controllers: [UsersController],
  exports: [JwtStategy, PassportModule, UsersRepository],
})
export class UsersModule {}
