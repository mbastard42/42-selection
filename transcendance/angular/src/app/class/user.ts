import { Injectable } from '@angular/core';

export class User{
    id: number;
    name: string;
    email: string;
    profil_file: string;

    constructor(){
        this.name = "";
        this.email = "";
        this.profil_file = "";
        this.id = 0;
    }

    public getUsername = () => {
        return this.name;
    }

    public getEmail = () => {
        return this.email;
    }

    public getProfilFile  = () =>{
        return this.profil_file;
    }

    public getId  = () : number =>{
        return this.id;
    }

    public setUsername = (username: string) => {
        this.name = username;
    }


    public setEmail = (email: string) : void => {
        this.email = email;
    }


    public setProfilFile = (profil_file: string) =>{
        this.profil_file = profil_file;
    }

    public setId = (id: number) =>{
        this.id = id;
    }

    public toString(){
        return this.name +  " " + this.email + " " + this.profil_file + " " + this.id;
    }

}