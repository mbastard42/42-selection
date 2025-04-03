import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UserService } from "../services/user/user.service";
import { User } from "../class/user";
import { Injectable } from "@angular/core";
import { SocketService } from "../services/socket/socket.service";
import { NavService } from "../services/nav/nav.service";

@Injectable()
export class AuthRequest{

    constructor(public http : HttpClient, private readonly navService : NavService){}

    async requestFailedLogic(er : HttpErrorResponse)
    {
        alert("Connection lost with the server, please reconnect : \n" + er.message);
        this.navService.navigateToId("/")
        await new Promise(resolve => setTimeout(resolve, 200));
        window.location.reload();
    }
    

    async is2FAEnabled(userId: number) : Promise<boolean | undefined>
    {
      try {
        return await this.http.post<boolean>("http://localhost:3000/users/is2FAEnabled", {id: userId}).toPromise();
      } catch (error)
      {
        this.requestFailedLogic(error as HttpErrorResponse);
      }
      return undefined
    }

    async is2FAValid(userId: number, code: string) : Promise<number | undefined>
    {
        try {
            return await this.http.post<number>("http://localhost:3000/users/is2FAValid", {userId: userId, code: code}).toPromise();
        } catch (error) {
            this.requestFailedLogic(error as HttpErrorResponse);
        }
        return undefined;
    }
    async configUser(email: string, username: string, profil_file: string) : Promise<{status: number, user: User, token: string} | undefined>
    {
      try {
        return await this.http.post<{status: number, user: User, token: string}>("http://localhost:3000/users/configUser", {email: email, username: username, profil_file: profil_file}).toPromise();
      } catch (error)
      {
        this.requestFailedLogic(error as HttpErrorResponse)
;
      }
      return undefined
    }
  
    async register(email : string, passwd : string) : Promise<{status: number, user: User, token: string} | undefined> {
        try {
          // return await this.http.post<{user : User, token : string}>("http://localhost:3000/users/register", {user : inputUser, password : passwd}).toPromise();
          return await this.http.post<{status: number, user : User, token : string}>("http://localhost:3000/users/register", {email : email, password : passwd}).toPromise();
        } catch (error) {
          this.requestFailedLogic(error as HttpErrorResponse)
;
        }
        return undefined;
      }

      async get42IntraLoginUrl() : Promise<{url: string} | undefined>
      {
        try{
          return await this.http.get<{url : string}>("http://localhost:3000/users/login42").toPromise();
        } catch(error) {
          this.requestFailedLogic(error as HttpErrorResponse)
;
        }
        return undefined;
      }

      async loginWith42(code: string) : Promise<{status: number, user: User; token: string; } | undefined>
      {
        try{
          return await this.http.post<{status: number, user : User, token : string}>("http://localhost:3000/users/login42", {code: code}).toPromise();
        } catch(error) {
          this.requestFailedLogic(error as HttpErrorResponse)
;
        }
        return undefined;
      }
    
      async logIn(email : string, passwd : string, TFACode: string = "") : Promise<{status: number, user: User; token: string; } | undefined> {
        try{
          if (TFACode.length == 0)
            return await this.http.post<{status: number, user : User, token : string}>("http://localhost:3000/users/login", {email : email, password : passwd}).toPromise();
          else
            return await this.http.post<{status: number, user : User, token : string}>("http://localhost:3000/users/login2FA", {email : email, password : passwd, code: TFACode}).toPromise();
        }
        catch(error){
          this.requestFailedLogic(error as HttpErrorResponse);
        }
        return undefined;
    }

    async toggle2FA(userId: number) : Promise<{status: number, key: string} | undefined>
    {
        try{
          return await this.http.post<{status: number, key: string}>("http://localhost:3000/users/toggle2FA", {id: userId}).toPromise();
        }
        catch(error){
          this.requestFailedLogic(error as HttpErrorResponse)
;
        }
      return undefined;
    }


}