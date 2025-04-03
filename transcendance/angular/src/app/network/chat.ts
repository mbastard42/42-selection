import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { chat } from "../class/chat";
import { message } from "../class/message";
import { UserService } from "../services/user/user.service";
import { Injectable } from "@angular/core";
import { Observable, catchError, of } from "rxjs";
import { NavService } from "../services/nav/nav.service";

@Injectable()
export class ChatRequest
{
    constructor(public http : HttpClient, protected readonly userService: UserService, private readonly navService: NavService){}

    async requestFailedLogic(er : HttpErrorResponse)
    {
        alert("Connection lost with the server, please reconnect : \n" + er.message);
        this.navService.navigateToId("/")
        await new Promise(resolve => setTimeout(resolve, 200));
        window.location.reload();
    }
    
    //--------------------------CHAT------------------------

    //-----------AUTH---------------

    async createChannel(chatName: string, passwd: string, isPrivate: boolean)
    {
        try {
            return await this.http.post<number>("http://localhost:3000/chats/createChannel", {name : chatName, password : passwd, user : this.userService.getUser(), isPrivate : isPrivate}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }

    async joinChat(chatId : number)
    {
        try {
            return await this.http.post<number>("http://localhost:3000/chats/joinPublicChat", {chat_id : chatId, user : this.userService.getUser()}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }

    async leaveChat(chatId: number)
    {
        try {
            return await this.http.post<number>("http://localhost:3000/chats/leaveChat", {chat_id : chatId, user : this.userService.getUser()}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }

    async inviteFriend(chatId: number, userId: number, friendId: number)
    {
        try {
            return await this.http.post<number>("http://localhost:3000/chats/inviteFriend", {chat_id : chatId, user : userId, target : friendId}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }

    async joinChatWithPassword(chatId: number, passwd: string)
    {
        try {
            return await this.http.post<number>("http://localhost:3000/chats/joinProtectedChat", {chat_id : chatId, user : this.userService.getUser(), password : passwd}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }


    //-----------ACTION-------------

    async sendMessage(newMessage: message) : Promise<number | undefined>
    {
        try{
            return await this.http.post<number>("http://localhost:3000/messages/add", {msg : newMessage} ).toPromise();
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }

    async muteUser(chatId: number, targetId: number ,time: string) : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>("http://localhost:3000/chats/muteUser", {chat_id : chatId, target_id : targetId, time : time}).toPromise();
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }

    async changeAdmin(chatId: number, targetId: number) : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>("http://localhost:3000/chats/updateAdmin", {chat_id : chatId, user: this.userService.getUser().id, target : targetId}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }

    async changeChatName(chatId: number, newName: string) : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>("http://localhost:3000/chats/updateName", {chat_id : chatId, name : newName}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }

    async changeChatPassword(chatId: number, paswd: string) : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>("http://localhost:3000/chats/updatePassword", {chat_id : chatId, password : paswd}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }

    async changeChatIsPrivate(chatId: number, isPrivate: boolean) : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>("http://localhost:3000/chats/updateIsPrivate", {chat_id : chatId, isPrivate : isPrivate}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }


    //--------GETTER-------------

    async isMutted(chatId: number) : Promise<boolean | undefined>
    {
        try {
            return await this.http.post<boolean>("http://localhost:3000/chats/isMutted", {chat_id : chatId, user_id : this.userService.getUser().id}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }

    async getChatInfos(chatId: number) : Promise<chat | undefined>
    {
        try {
            return await this.http.post<chat>("http://localhost:3000/chats/id", {id : chatId}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }

    async getChatMessages(chatId: number) : Promise<message[] | undefined>
    {
        try {
            return await this.http.post<message[]>("http://localhost:3000/messages/chatId", {id : chatId}).toPromise()
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }

    async getPublicChats() : Promise<chat[] | undefined>
    {
        try{
            return await this.http.post<chat[]>("http://localhost:3000/chats/getPublicChats", {}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined
    }

    async getDirectChatId(otherId : number) : Promise<chat | undefined>
    {
        try {
        return await this.http.post<chat>('http://localhost:3000/chats/directWithId', {current: this.userService.getUser().id, other : otherId }).toPromise()
        }catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined;
    }

    async getAllChatsOfUser() : Promise<chat[] | undefined>
    {
        try {
            return await this.http.post<chat[]>('http://localhost:3000/chats/getChatsByUserId', {id : this.userService.getUser().id}).toPromise();
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)

        }
        return undefined;
    }
}