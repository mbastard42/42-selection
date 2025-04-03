import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    token: string;

    @Column('text', {default: "Original"})
    theme: string;

    @Column('text', {default: ""})
    GAsecretEncrypted: string;

    @Column('text', {default: ""})
    KeyToCrypt: string;

    @Column('text', {default: ""})
    IV: string;

    @Column('int', {array: true, default: []})
    blocked_id : number[]

    @Column('boolean', {default: false})
    is42: boolean;

    constructor()
    {
        this.name = "";
        this.email = "";
        this.password = "";
        this.token = "";
        this.blocked_id = [];
    }

}