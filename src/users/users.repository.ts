import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<User> {
  private logger = new Logger('UsersRepository');

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(userCredentialsDto: UserCredentialsDto): Promise<void> {
    const { username, password } = userCredentialsDto;

    // There is a bug in @Column({ unique: true }), so it cannot be handled that way
    // Custom checkup is implemented to find if the usernam exists
    this.logger.verbose(`Checking if the user exists`);
    const existing = await this.findOneBy({ username: username });
    if (existing) {
      this.logger.error(`${username} already exists`);
      throw new ConflictException(`Username "${username}" already exists.`);
    }

    // Hashing password
    this.logger.verbose(`Hashing password`);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    this.logger.verbose(`Saving user to the database`);
    const user = this.create({ username, password: hashedPassword });
    this.save(user);
  }
}
