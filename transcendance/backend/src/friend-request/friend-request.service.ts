import { Injectable } from '@nestjs/common';

@Injectable()
export class FriendRequestService {
    
    RequestQueue : Array<[number, number]> = [];

    constructor() {
        this.clean();
    }


    getRequest(asker : number, secondId : number) : [number, number]
    {
        return this.RequestQueue.filter(item => this.check(item, asker, secondId))[0];
    }

    getRequestsFromId(id : number) : Array<[number, number]>
    {
        return this.RequestQueue.filter(item => item[1] == id || item[0] == id);
    }

    addRequest(asker : number, secondId : number) : void
    {
        if (!this.searchRequest(asker, secondId) || !this.searchRequest(secondId, asker))
            this.RequestQueue.push([asker, secondId]);
    }

    removeRequest(firstUser : number, secondUser : number) : void
    {
        this.RequestQueue = this.RequestQueue.filter((item: number[]) => item[0] != firstUser && item[1] != secondUser);

    }

    getAllRequest() : Array<[number, number]>
    {
        return this.RequestQueue;
    }

    searchRequest(asker : number, secondId : number) : boolean
    {
        return this.RequestQueue.filter(item => this.check(item, asker, secondId)).length > 0;
    }

    check(request : [number, number], asker : number, secondId : number) : boolean
    {
        return (request[0] == asker && request[1] == secondId);
    }

    print(label : string = "") : void
    {
        console.log(label);
        console.log(this.RequestQueue);
    }

    clean() : void
    {
        this.RequestQueue = [];
    }


}
