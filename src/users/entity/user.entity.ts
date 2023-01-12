import { Message } from '../../messages/entity/messages.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @OneToMany(() => Message, (message) => message.sender)
  @OneToMany(() => Message, (message) => message.receiver)
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;
}
