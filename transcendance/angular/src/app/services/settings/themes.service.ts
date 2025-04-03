import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemesService {

  private themes: Map<string, string[]> = new Map();

  constructor() { 
    this.themes.set('Original', ['#1E0B0B', '#843110', '#C9AD35', '#E0DCC1', '#A37B7B']);
    this.themes.set('Dark', ['#000000', '#999999', '#666666', '#333333', '#ffffff']);
    this.themes.set('Light', ['#ffffff', '#333333', '#666666', '#999999', '#000000']);
  }

  /*async setTheme(user: User) : Promise<number>
  {
    const response = await this.authRequest.setTheme(this.userService.getUser().id, theme);
    if (!response)
      return 400; // request failed
    if (response.status != 200)
      return response.status;
    this.userService.getUser().theme = theme;
    return 200;
  }*/

  getThemes() {
    return this.themes;
  }

  /*changeTheme(theme: string) {
    const current: string[] = this.themes[theme];
    document.documentElement.style.setProperty('--background-color', current[0]);
    document.documentElement.style.setProperty('--primary-color', current[1]);
    document.documentElement.style.setProperty('--secondary-color', current[2]);
    document.documentElement.style.setProperty('--accent-color', current[3]);
    document.documentElement.style.setProperty('--text-color', current[4]);
  }*/

}
