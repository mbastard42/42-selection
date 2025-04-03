import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Avatar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bytea', nullable: true })
  uint8Array: Uint8Array;

  @Column()
  userID: number;
}