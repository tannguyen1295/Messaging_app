import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  sender_id: string;

  @Column()
  receiver_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_date: Date;
}
