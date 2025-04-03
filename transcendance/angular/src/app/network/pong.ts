import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { User } from "../class/user";
import { UserService } from "../services/user/user.service";
import { Injectable } from "@angular/core";
import { NavService } from "../services/nav/nav.service";

@Injectable()
export class PongRequest
{

    constructor(public http : HttpClient, protected readonly userService: UserService, private readonly navService: NavService){}

    async requestFailedLogic(er : HttpErrorResponse)
    {
        alert("Connection lost with the server, please reconnect : \n" + er.message);
        this.navService.navigateToId("/")
        await new Promise(resolve => setTimeout(resolve, 200));
        window.location.reload();
    }

    
    // -------------MATCHCMAKING-----------

    async acceptDuel(opponent_id : number)
    {
        try {
            return await this.http.post<number>('http://localhost:3000/matchmaking/acceptDuel', {id: this.userService.getUser().id, other: opponent_id}).toPromise();
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }
    
    async joinPong() : Promise<number | undefined>
    {
        try {
        return await this.http.post<number>('http://localhost:3000/games/joinCurrentGame', {id: this.userService.getUser().id}).toPromise();
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }

    async leavePong() : Promise<number | undefined>
    {
        try {
        return await this.http.post<number>('http://localhost:3000/games/leaveCurrentGame', {id: this.userService.getUser().id}).toPromise();
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }

    async joinMatchmaking() : Promise<number | undefined>
    {
        try {
        return await this.http.post<number>('http://localhost:3000/matchmaking/start', {id: this.userService.getUser().id}).toPromise();
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }

    async cancelMatchmaking(): Promise<number | undefined>
    {
        try {
        return await this.http.post<number>('http://localhost:3000/matchmaking/cancel', {id: this.userService.getUser().id}).toPromise();
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }

    async joinSpecialMatchmaking() : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>('http://localhost:3000/matchmaking/startSpecial', {id: this.userService.getUser().id}).toPromise();
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }

    async cancelSpecialMatchmaking(): Promise<number | undefined>
    {
        try {
        return await this.http.post<number>('http://localhost:3000/matchmaking/cancelSpecial', {id: this.userService.getUser().id}).toPromise();
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }


    async gameType() : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>('http://localhost:3000/games/actualGameType', {id: this.userService.getUser().id}).toPromise();
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }

    // -----------------------------------GAME----------------------------------

    async getCurrentGames() : Promise<Array<{
        id : number,
        players : Array<string>
    }> | undefined>
    {
        try {
            return await this.http.get<Array<{id : number, players : Array<string>}>>('http://localhost:3000/games/getCurrentGames').toPromise();
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }

    async isInGame(userId: number) : Promise<boolean | undefined>
    {
        try {
            return await this.http.post<boolean>('http://localhost:3000/games/doInGame', {id: userId}).toPromise();
        } catch(error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined;
    }

    async movePaddleUp()
    {
        try {
            return await this.http.post("http://localhost:3000/games/paddleUp" , {id: this.userService.user.id}).toPromise()
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }

    async movePaddleDown()
    {
        try {
            return await this.http.post("http://localhost:3000/games/paddleDown" , {id: this.userService.user.id}).toPromise()
        }
        catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }

    async updateInfosFromGame(gameId : number) : Promise<any | undefined> {
        try{
            return await this.http.post<any>("http://localhost:3000/games/getGameInfosById", {id: gameId}).toPromise()
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined;
    }

    async updateInfosFromUser(userId : number = this.userService.user.id) : Promise<any | undefined> {
        try{
            return await this.http.post<any>("http://localhost:3000/games/getGameInfos", {id: userId}).toPromise()
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined

    }

    async executePower(power: number)
    {
        try {
        return await this.http.post("http://localhost:3000/games/execute" , {id: this.userService.user.id, action: power}).toPromise()
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined
    }

    async updateInfos(userId : number = this.userService.user.id) : Promise<any | undefined> {
        try{
            return await this.http.post<any>("http://localhost:3000/games/getGameInfos", {id: userId}).toPromise()
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse)
        }
        return undefined;
    }


}