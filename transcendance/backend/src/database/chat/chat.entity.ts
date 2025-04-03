import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Chat {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    name: string;

    @Column('int', { array: true, default: [] })
    users_id: number[];

    @Column({ default: -1 })
    owner_id: number;

    @Column('int', { array: true, default: [] })
    admins_id: number[];

    @Column('int', { array: true, default: [] })
    bans_id: number[];

    @Column('text', { array: true, default: [] })
    users_name: string[];

    @Column({ default: true })
    isPrivate: boolean;

    @Column({ default: false })
    isDirect: boolean;

    @Column({ default: "" })
    password: string;
}