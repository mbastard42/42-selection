import { Injectable } from '@angular/core';
import { chat } from 'src/app/class/chat';
import { message } from 'src/app/class/message';
import { SocketService } from '../socket/socket.service';
import { UserRequest } from 'src/app/network/user';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatInfos : chat = new chat(-1, 0,[], [], [], "", [], true, false);
  blockedNamesList : Array<string> = [];
  messages : Array<message> = [];

  constructor(private readonly userRequest: UserRequest) {
  }

  async updateChatService(newchat : chat, msg : message[])
  {
    this.setChatInfos(newchat);
    this.setMessages(msg);
    this.blockedNamesList = [];
    for (let i = 0; i < this.chatInfos.bans_id.length; i++)
    {
      const user = await this.userRequest.getUser(this.chatInfos.bans_id[i]);
      if (user && this.blockedNamesList.includes(user.name) == false)
        this.blockedNamesList.push(user.name);
    }
  }

  getChatInfos() : chat
  {
    return this.chatInfos;
  }

  getMessages() : Array<message>
  {
    return this.messages;
  }

  setChatInfos(chat : chat)
  {
    this.chatInfos = chat;
  }

  setMessages(messages : Array<message>)
  {
    this.messages = messages;
  }

  resetMessages()
  {
    this.messages = new Array<message>;
  }

  resetInfos()
  {
    this.chatInfos = new chat(-1, 0,[], [], [], "", [], true, false);
  }

  resetChatService()
  {
    this.resetMessages();
    this.resetInfos();
  }
  
}
