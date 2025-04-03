import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { chat } from 'src/app/class/chat';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { ChatRequest } from 'src/app/network/chat';
@Injectable({
  providedIn: 'root'
})
export class ChatListService {

  chatList : Array<chat> | undefined = [];

  constructor(public chatRequest: ChatRequest, public userService : UserService, public authService : AuthService) { 
    this.chatList = undefined;
  }

  async updateChatListFromBackend() : Promise<Array<chat> | undefined>
  {
    const value = await this.chatRequest.getAllChatsOfUser();
    this.chatList = value;
    return value
  }

  public getChatList()
  {
    return this.chatList;
  }

  public addChatChannel(channel : chat)
  {
    if (this.chatList)
      this.chatList.push(channel);
  }
  
  public getChatChannelByIndex(index : number) : chat | undefined
  {
    if (this.chatList)
      return this.chatList[index];
    return undefined;
  }

}
