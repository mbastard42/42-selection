import { Injectable } from "@angular/core";
import { Score } from "../class/score";
import { User } from "../class/user";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { NavService } from "../services/nav/nav.service";


@Injectable()
export class UserRequest 
{
    constructor(public  http : HttpClient, private navService: NavService){
    }

    async requestFailedLogic(er : HttpErrorResponse)
    {
        alert("Connection lost with the server, please reconnect : \n" + er.message);
        this.navService.navigateToId("/")
        await new Promise(resolve => setTimeout(resolve, 200));
        window.location.reload();
    }
    

    // ------------------------AVATAR------------------------

    async setAvatar(userId : number, avatar : File) : Promise<number | undefined>
    {
        const arrayBuffer = await this.readFileAsArrayBuffer(avatar);
        const buffer = new Uint8Array(arrayBuffer);
        return await this.http.post<number>("http://localhost:3000/avatar/upload", {userId: userId, buffer: Array.from(buffer)}).toPromise();
    }

    async getAvatar(userId : number) : Promise<string | undefined>
    {
        const res = await this.http.post<any>('http://localhost:3000/avatar/getAvatar', {id: userId}).toPromise();
        const arrayBuffer = this.toArrayBuffer(res?.data);
        if (res && arrayBuffer)
        {
            const blob = new Blob([arrayBuffer], {type: 'image/jpeg'});
            return URL.createObjectURL(blob);
        }
        return "";
    }

    private toArrayBuffer(buffer: any): ArrayBuffer {
        const arrayBuffer = new Uint8Array(buffer).buffer;
        return arrayBuffer as ArrayBuffer;
      }
    

    private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
    
          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            resolve(arrayBuffer);
          };
    
          reader.onerror = (error) => {
            reject(error);
          };
    
          reader.readAsArrayBuffer(file);
        });
      }

     //------------------ACTION------------------


    async blockUser(id: number, otherId: number)
    {
        try {
            return await this.http.post<number>('http://localhost:3000/users/blockId', {id: id, other: otherId}).toPromise()
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse);
        }
        return undefined
    }

    async unblockUser(id: number, otherId: number)
    {
        try {
            console.log("unblockuser")
            return await this.http.post<number>('http://localhost:3000/users/unblockId', {id: id, other: otherId}).toPromise()
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse);
        }
        return undefined
    }

    async searchUsersFromName(name : string) : Promise<User[] | undefined>
    {
        try {
            return await this.http.post<User[]>('http://localhost:3000/users/search-username', {username: name}).toPromise()
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse);
        }
        return undefined;
    }

    async removeUser(userId : number)
    {
        try{
            return await this.http.delete("http://localhost:3000/users/" + userId).toPromise();
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse);
        }
        return undefined;
    }

    async updateUser(newUser: User) : Promise<User | undefined>
    {
        try {
            return await this.http.put<User>("http://localhost:3000/users/" + newUser.id, newUser).toPromise();
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse);
        }    
        return undefined;
    }

    async editUsername(userId: number, newName: string) : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>("http://localhost:3000/users/editUsername", {id: userId, username: newName}).toPromise();
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse);
        }
        return undefined;
    }
    //------------------GETTER------------------

    async getUser(userId : number) : Promise<User | undefined>
    {
        try {
            return await this.http.post<User>("http://localhost:3000/users/id", {userId: userId}).toPromise();
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse);
        }
        return undefined;
    }

    async getBlockedList(userId : number)
    {
        try {
            return await this.http.post<Array<number>>('http://localhost:3000/users/getBlockList', {id: userId}).toPromise();
        } catch (error) {
            console.log(error)
            this.requestFailedLogic(error as HttpErrorResponse);
        }
        return undefined
    }
    async getUserIdFromUsername(name : string) : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>('http://localhost:3000/users/getUserId', {username: name}).toPromise()
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse);
        }
        return undefined
    }

    async getUserFromUsername(name: string) : Promise<User | undefined>
    {
        try {
            return await this.http.post<User>("http://localhost:3000/users/username", {username: name}).toPromise()
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse);
        }   
        return undefined
    }

    async getUserScore(userId: number) : Promise<Score[] | undefined>
    {
        try {
            return await this.http.post<Score[]>("http://localhost:3000/scores/userid", {id: userId}).toPromise()
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse);
        }
        return undefined
    }

    async getUserNotifications(userId : number) : Promise<Array<string> | undefined>
    {
        try {
            return await this.http.get<Array<string>>("http://localhost:3000/notifications?id=" + userId).toPromise();
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse);
        }
        return undefined;
    }
}