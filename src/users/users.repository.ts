import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, EntityRepository, Repository } from 'typeorm';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(userCredentialsDto: UserCredentialsDto): Promise<void> {
    const { username, password } = userCredentialsDto;

    // There is a bug in @Column({ unique: true }), so it cannot be handled that way
    // Custom checkup is implemented to find if the usernam exists
    const existing = await this.findOneBy({ username: username });
    if (existing) {
      throw new ConflictException(`Username "${username}" already exists.`);
    }

    // Hashing password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });
    this.save(user);
  }
}
