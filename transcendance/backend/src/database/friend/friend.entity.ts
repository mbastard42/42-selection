import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Friend {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    user_id: number;

    @Column('int', {array: true, default: []})
    friends_id: number[];
}