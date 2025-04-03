export class chat
{
    id : number;
    name : string;
    users_id : Array<number>;
    owner_id : number;
    admins_id : Array<number>;
    bans_id : Array<number>;
    users_name : Array<string>;
    isDirect : boolean;
    isPrivate : boolean;

    constructor(id : number, owner_id : number , users_id : Array<number>, admin_id : Array<number>, bans_id: Array<number> , name : string,users_name : Array<string>, isDirect : boolean, isPrivate : boolean) {
        this.id = id;
        this.owner_id = owner_id;
        this.users_id = users_id;
        this.admins_id = admin_id;
        this.bans_id = bans_id;
        this.users_name = users_name
        this.name = name;
        this.isDirect = isDirect;
        this.isPrivate = isPrivate;
    }
}