import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Message {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  user_id: number;

  @Column()
  chat_id: number;
}