import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';

export enum menuIndex {NONE, HOMESCREEN, PROFILESCREEN, FRIENDLIST, CHATLIST, PONG, SPECIALPONG,CHAT, OTHERPROFILE, LOGINSCREEN, SCORE, NOTIF, SEARCH};

@Injectable({
  providedIn: 'root'
})
export class RootingService {

  actualMenu : menuIndex;
  lastMenu : Array<{menu: menuIndex, option: any}>;
  option : any;
  constructor() {
    this.actualMenu = menuIndex.HOMESCREEN;
    this.lastMenu = [];
  }

  popScreen()
  {
    const oldMenu = this.lastMenu.at(this.lastMenu.length - 1);
    if (oldMenu)
    {
      this.option = oldMenu.option;
      this.actualMenu = oldMenu.menu;
    }
    this.lastMenu.pop();
  }

  pushScreen(index : menuIndex, newOption : any = null)
  {
    this.lastMenu.push({menu: this.actualMenu, option: this.option});
    if (index == menuIndex.HOMESCREEN)
      this.lastMenu = [];
    this.option = newOption;
    this.actualMenu = index;
  }

  goToHomeScreen()
  {
    this.pushScreen(menuIndex.HOMESCREEN);
  }

  goToProfileScreen()
  {
    this.pushScreen(menuIndex.PROFILESCREEN);
  }

  goToOtherProfileScreen(username : string)
  {
    this.pushScreen(menuIndex.OTHERPROFILE, username);
  }
  goToChatListScreen()
  {
    this.pushScreen(menuIndex.CHATLIST);
  }

  goToChat(chatId : number)
  {
    this.pushScreen(menuIndex.CHAT, chatId);
  }

  goToScore(username : string)
  {
    this.pushScreen(menuIndex.SCORE, username);
  }

  goToFriendListScreen()
  {
    this.pushScreen(menuIndex.FRIENDLIST);
  }

  goToLoginScreen()
  {
    this.pushScreen(menuIndex.LOGINSCREEN);
  }

  goToPong()
  {
    this.pushScreen(menuIndex.PONG);
  }

  goToSpecialPong()
  {
    this.pushScreen(menuIndex.SPECIALPONG);
  }

  goToNotifScreen()
  {
    this.pushScreen(menuIndex.NOTIF)
  }

  goToUserSearch()
  {
    this.pushScreen(menuIndex.SEARCH);
  }

  isUserSearching()
  {
    return this.actualMenu == menuIndex.SEARCH;
  }

  isNotifScreen()
  {
    return this.actualMenu == menuIndex.NOTIF;
  }


  isHomeScreen()
  {
    return this.actualMenu == menuIndex.HOMESCREEN;
  }

  isProfileScreen()
  {
    return this.actualMenu == menuIndex.PROFILESCREEN;
  }

  isOtherProfileScreen()
  {
    return this.actualMenu == menuIndex.OTHERPROFILE;
  }

  isFriendListScreen()
  {
    return this.actualMenu == menuIndex.FRIENDLIST;
  }

  isScoreScreen()
  {
    return this.actualMenu == menuIndex.SCORE;
  }

  isChatListScreen()
  {
    return this.actualMenu == menuIndex.CHATLIST;
  }

  isChatScreen()
  {
    return this.actualMenu == menuIndex.CHAT;
  }

  isLoginScreen()
  {
    return this.actualMenu == menuIndex.LOGINSCREEN;
  }

  isInPong()
  {
    return this.actualMenu == menuIndex.PONG;
  }

  isInSpecialPong()
  {
    return this.actualMenu == menuIndex.SPECIALPONG;
  }

}
