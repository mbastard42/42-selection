import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/class/user';
import { AuthRequest } from 'src/app/network/auth';
import { SocketService } from '../socket/socket.service';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  islog = false;
  token = "";

  constructor(
    public userService: UserService, 
    public authRequest: AuthRequest, 
    private readonly socketService : SocketService,
    public settingsService : SettingsService
  ) { }

  isLogIn() {
    return this.islog;
  }

  async configUser(email: string, username: string, profil_file: string)
  {
    const response = await this.authRequest.configUser(email, username, profil_file);
    if (response)
    {
        if (response.status != 200)
          return response.status;
        return this._connectUser(response.user, response.token);
    }
    return 400; // request failed
  }

  async register(email: string, password: string) : Promise<number>
  {
    const response = await this.authRequest.register(email, password);
    if (response)
      return response.status;
    else
      return 404; // request failed
  }

  async loginWith42(code: string) : Promise<number>
  {
    const response = await this.authRequest.loginWith42(code);
    if (response)
    {
      if (response.status == 200)
        return this._connectUser(response.user, response.token);
      else if (response.status == 202)
        this.userService.setUser(response.user);
      else if (response.status == 201)
      {
        const FAcode = prompt("Enter 2FA code");
        if (await this.authRequest.is2FAValid(response.user.id, FAcode!) == 200)
          return this._connectUser(response.user, response.token);
        else
          return 401;
      }
      return response.status;
    }
    return 400;
  }

  async open42IntraURL() : Promise<number>
  {
    const response = await this.authRequest.get42IntraLoginUrl();
    if (response)
    {
      if (window.open(response.url, "_self")) //_self: open in the current tab - _blank: open in a new tab - name: open in the tab with the name "name" (if it doesn't exist, open in a new tab) - url: open in the tab with the url "url" (if it doesn't exist, open in a new tab)
        return 200;
    }
    return 400;
  }

  async logIn(email : string, password : string, TFACode: string = "") : Promise<number>
  {
    const response = await this.authRequest.logIn(email, password, TFACode);
    if (!response)
      return 400; // request failed
    if (response.status == 202)
      this.userService.setUser(response.user);
    if (response.status != 200)
      return response.status; // login failed
    return this._connectUser(response.user, response.token);
  }

  async _connectUser(user : User, token: string) : Promise<number>
  {
    this.socketService.connectToServer(token);
    this.userService.setUser(user);
    await this.userService.updateProfilePictureFromBackend();
    this.token = token;
    this.islog = true;
    return 200;
  }




  async logOut() {
    const response = this.socketService.disconnectToServer();
    if (response != 200)
      return;
    this.islog = false;
    this.token = "";
    this.userService.resetUser();
  }

}
