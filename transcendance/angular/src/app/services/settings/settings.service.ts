import { Injectable } from '@angular/core';
import { User } from 'src/app/class/user';
import { ThemesService } from './themes.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }


  /*async setSettings(user: User) : Promise<number>
  {

    user.getTheme();

    const response = await this.authRequest.setSettings(this.userService.getUser().id, user);
  
    if (!response)
      return 400; // request failed
    if (response.status != 200)
      return response.status;
    this.userService.getUser().settings = user.settings;
    return 200;
  }*/
}
