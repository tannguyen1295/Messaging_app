import { Message } from '..//messages/messages.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Message, (message) => message.sender)
  @OneToMany(() => Message, (message) => message.receiver)
  messages: Message[];
}
