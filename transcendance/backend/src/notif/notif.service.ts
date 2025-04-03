import { Injectable } from '@nestjs/common';
import { SocketService } from 'src/socket/socket.service';


@Injectable()
export class NotifService {
    notifMap : Map<number, Array<String>> = new Map<number, Array<string>>();

    constructor(private socketService: SocketService) {}

    addNotification(id : number, notif : string) : void
    {
        // console.log("FRIEND ID (before up) : " + id)
        // id++;
        // console.log("FRIEND ID (after up) : " + id)
        // if (!this.notifMap.has(id))
        //     this.notifMap.set(id, []);
        // this.notifMap.get(id).push(notif);
        this.socketService.sendNotifToClient(id, notif);
    }

    getUserNotifications(id : number) : Array<String>
    {
        id++;
        if (!this.notifMap.has(id))
            this.notifMap.set(id, []);
        const returned = this.notifMap.get(id);
        this.notifMap.set(id, []);
        return returned;
    }

}
