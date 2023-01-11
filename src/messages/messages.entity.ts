import { User } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.id)
  sender: User;

  @ManyToOne(() => User, (user) => user.id)
  receiver: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;
}
