import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UserService } from "../services/user/user.service";
import { NavService } from "../services/nav/nav.service";

@Injectable()
export class FriendRequest
{
    constructor(public http : HttpClient, protected readonly userService: UserService, private navService: NavService) {}

    async requestFailedLogic(er : HttpErrorResponse)
    {
        alert("Connection lost with the server, please reconnect : \n" + er.message);
        this.navService.navigateToId("/")
        await new Promise(resolve => setTimeout(resolve, 200));
        window.location.reload();
    }

    
    //---------------ACTION--------------------

    async addFriend(otherId : number) : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>("http://localhost:3000/friends/add", {id: this.userService.getUser().id , friend_id: otherId}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }

    async removeFriend(otherId: number) : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>("http://localhost:3000/friends/remove", {id: this.userService.getUser().id , friend_id: otherId}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)


        }
        return undefined
    }

    async cancelRequest(otherId: number) : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>("http://localhost:3000/friends/cancel", {id: this.userService.getUser().id , friend_id: otherId}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)


        }
        return undefined
    }

    //---------------GETTER----------------

    async getFriendshipStatus(otherId : number) : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>("http://localhost:3000/friends/checkStatus", {id: this.userService.getUser().id , friend_id: otherId}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)


        }
        return undefined
    }
    async getFriendList() : Promise <{list : string[], status: number[]} | undefined>
    {
        try {
            return await this.http.post<{list : string[], status : number[]}>('http://localhost:3000/friends/getFriendList', {id: this.userService.getUser().id}).toPromise()
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)


        }
        return undefined
    }

    async getUserStatus(otherId : number) : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>("http://localhost:3000/friends/getUserStatus", {id: this.userService.getUser().id , friend_id: otherId}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }


}