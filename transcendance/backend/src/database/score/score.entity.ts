import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Score {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {array: true, default: []})
    users_id: number[];

    @Column('text', {array: true, default: []})
    users_username: string[];

    @Column('int', {array: true, default: []})
    score: number[]; 

    @Column()
    winner_id: number;
        
}