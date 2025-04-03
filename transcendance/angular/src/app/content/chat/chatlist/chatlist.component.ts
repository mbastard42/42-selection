import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { chat } from 'src/app/class/chat';
import { ChatRequest } from 'src/app/network/chat';
import { ServiceIncludes } from 'src/app/services/includes';
import { NavService } from 'src/app/services/nav/nav.service';

enum screen {MAIN, CHANNELCREATION, BROWSECHANNELS}
@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css']
})
export class ChatlistComponent{

  publicChatList : Array<chat> | undefined = [];
  acutalScreen : screen = screen.MAIN;

  newchannelName : string = "";
  newchannelPassword : string = "";
  newPrivacy : boolean = false;

  label = "";


  constructor(private readonly chatRequest: ChatRequest, private readonly services: ServiceIncludes, private rooter: Router, private navService: NavService) {
    this.navService.setElem({id: 'nav_mychat/chat', left: 'nav_browsechat/chat', right: 'nav_createchat/chat', nextBehavior: this.backToMainScreen, downBehavior: this.moveDownToBody})

    this.navService.setElem({id: 'nav_browsechat/chat', right: 'nav_mychat/chat', nextBehavior: this.browseChannels, downBehavior: this.moveDownToBody})

    this.navService.setElem({id: 'nav_createchat/chat', left: 'nav_mychat/chat', nextBehavior: this.channelCreation, downBehavior: this.moveDownToBody})
    this.navService.setElem({id: 'channel-name_createchat/chat', up: 'nav_createchat/chat', down: 'channel-password_createchat/chat', nextBehavior: this.enterNewChannelName})
    this.navService.setElem({id: 'channel-password_createchat/chat', up: 'channel-name_createchat/chat', down: 'privacy_createchat/chat',nextBehavior: this.enterNewChannelPassword})
    this.navService.setElem({id: 'privacy_createchat/chat', up: 'channel-password_createchat/chat', down: 'create_createchat/chat', nextBehavior: this.toggleNewPrivacy})
    this.navService.setElem({id: 'create_createchat/chat', up: 'privacy_createchat/chat', nextBehavior: this.createChannel})

    this.navService.setDefaultElem('nav_mychat', '/chat');
    this.start();
  }


  async start(){
    this.updateChatList();
  }

  moveDownToBody = () => {
    if (this.isMainScreen())
    {
      if (!this.isUndefined() && this.isNotEmpty())
        this.navService.navigateToId('chat_mychat?0/chat');
    }
    else if (this.isChannelCreationScreen())
      this.navService.navigateToId('channel-name_createchat/chat');
    else if (this.isBrowseChannelsScreen())
    {
      if (this.publicChatList && this.publicChatList.length > 0)
        this.navService.navigateToId('chat_public?0/chat');
    }
  }

  enterNewChannelName = () => {
    this.navService.keyService.usingKeyboard(this.newchannelName, 'Enter', 0);
    this.navService.keyService.valueUpdate$?.subscribe((newValue) => { 
        if (this.navService.keyService.inputId == 0)
            this.newchannelName = newValue;
    });
  }

  enterNewChannelPassword = () => {
    this.navService.keyService.usingKeyboard(this.newchannelPassword, 'Enter', 1);
    this.navService.keyService.valueUpdate$?.subscribe((newValue) => { 
        if (this.navService.keyService.inputId == 1)
            this.newchannelPassword = newValue;
    });
  }

  async updateChatList()
  {
    this.label = "Loading...";
    const newChatList = await this.services.chatListService.updateChatListFromBackend();
    if (newChatList == undefined)
      this.label = "Error while loading chat list";
    else if (newChatList.length == 0)
      this.label = "You don't have any chat yet";
    else
    {
      this.label = "";
      this.navService.setArrayElem({id: 'chat_mychat?', route: '/chat', array: newChatList, before: 'nav_mychat/chat'})
      this.navService.setArrayElem({id: 'leave_mychat?', route: '/chat', array: newChatList, before: 'nav_mychat/chat'});
      this.services.chatListService.chatList?.forEach((chat, index) => {
        this.navService.setElem({id: 'leave_mychat?' + index + '/chat', left: 'chat_mychat?' + index + '/chat', nextBehavior: () => {this.leaveChat(chat.id); this.navService.moveUp()}})
        this.navService.setElem({id: 'chat_mychat?' + index + '/chat', next: 'msg_input/chat/chat/' + chat.id, right: 'leave_mychat?' + index + '/chat'})
        this.navService.setElem({id: 'msg_input/chat/chat/' + chat.id, prev: 'nav_mychat/chat'})

      });
    }
  }

  isSelected(id: string)
  {
    return this.navService.isSelected(id);
  }

  getNavClass(id: string, isActive: boolean)
  {
    const isSelected = this.isSelected(id)
    return {
      'navLabel-selected': isSelected,
      'navLabel-active': isActive,
      // 'active-navLabel': isActive,
      'navLabel': true,
    }
  }

  getChatIndex(chat : chat) : number
  {
    if (this.services.chatListService.getChatList())
      return this.services.chatListService.getChatList()!.indexOf(chat);
    return -1;
  }

  getPublicChatIndex(chat : chat) : number
  {
    if (this.publicChatList)
      return this.publicChatList.indexOf(chat);
    return -1;
  }

  //------------------------ACTIONS--------------------

  public toggleNewPrivacy = () =>
  {
    this.newPrivacy = !this.newPrivacy;
  }

  public showPublicChatList()
  {
    this.updatePublicChatList();
  }

  public browseChannels = () =>
  {
    this.label = "";
    this.navService.navigateToId('nav_browsechat/chat');
    this.acutalScreen = screen.BROWSECHANNELS;
    this.updatePublicChatList();
  }

  public channelCreation = () =>
  {
    this.label = "";
    this.navService.navigateToId('nav_createchat/chat');
    this.acutalScreen = screen.CHANNELCREATION;
  }

  public backToMainScreen = () =>
  {
    this.label = "";
    this.navService.navigateToId('nav_mychat/chat');
    this.acutalScreen = screen.MAIN;
    this.updateChatList();
  }


  //-------------------------REQUESTS------------------

  async updatePublicChatList()
  {
    this.label = "Loading...";
    const response = await this.chatRequest.getPublicChats();
    this.publicChatList = response;
    if (this.publicChatList == undefined)
      this.label = "Error while loading public channels";
    else if (this.publicChatList.length == 0)
      this.label = "No public channel found";
    else
    {
      this.label = "";
      this.navService.setArrayElem({id: 'chat_public?', route: '/chat', array: this.publicChatList, before: 'nav_browsechat/chat'})
      this.publicChatList.forEach((chat, index) => {
        this.navService.setElem({id: 'chat_public?' + index + '/chat', nextBehavior: () => this.joinPublicChat(chat)})
      });
    }
  }

  async joinPublicChat(channel : chat)
  {
    const value = await this.chatRequest.joinChat(channel.id)
    if (value)
    {
      if (value == 200)
        this.openChat(channel.id);
      else if (value == 400)
        this.services.notifService.addNotification("You are already in this channel");
      else if (value == 201)
        this.joinChatWithPassword(channel);
      else if (value == 401)
        this.services.notifService.addNotification("You are banned from this channel");
      else
        this.services.notifService.addNotification("error while joining chat: " + value)
    }
    else
      this.services.notifService.addNotification("error while getting channel: request error")
    this.updatePublicChatList();
  }

  leaveChat = async (id: number) =>
  {
    const value = await this.chatRequest.leaveChat(id);
    if (value && value != 200)
    {
      if (value == 404)
        this.services.notifService.addNotification("Can't leave this channel");
      else if (value == 400)
        this.services.notifService.addNotification("You are not in this channel");
      else if (value == 401)
        this.services.notifService.addNotification("You are the owner of this channel, you can't leave it");
      else if (value == 402)
        this.services.notifService.addNotification("You can't leave a direct chat");
    }
    this.navService.navigateToId('nav_mychat/chat');
    this.services.chatListService.updateChatListFromBackend();
  }

  async joinChatWithPassword(channel : chat)
  {
    const password = prompt("Enter the password of the channel");
    if (password)
    {
      const value = await this.chatRequest.joinChatWithPassword(channel.id, password)
      if (value)
      {
        if (value == 200)
          this.openChat(channel.id);
        else if (value == 400)
          this.services.notifService.addNotification("You are already in this channel");
        else if (value == 401)
          this.services.notifService.addNotification("Wrong password");
        else if (value == 404)
          this.services.notifService.addNotification("Channel not found");
      }
    }
  }

  createChannel = async () =>
  {
    if (this.newchannelName)
    {
      const value = await this.chatRequest.createChannel(this.newchannelName, this.newchannelPassword, this.newPrivacy)
      if (value)
      {
        if (value == 200)
        {
          this.services.chatListService.updateChatListFromBackend();
          this.backToMainScreen();
        }
        else if (value == 400)
          this.services.notifService.addNotification("Channel already exists");
        else if (value == 401)
          this.services.notifService.addNotification("Channel name is invalid (must be at least 3 characters long and 20 characters max)");
      }
    }
    else
      this.services.notifService.addNotification("You must enter a name for the channel")
  }

  //------------------------GETTER--------------------

  isMainScreen() : boolean
  {
    return this.acutalScreen == screen.MAIN;
  }

  isChannelCreationScreen() : boolean
  {
    return this.acutalScreen == screen.CHANNELCREATION;
  }

  isBrowseChannelsScreen() : boolean
  {
    return this.acutalScreen == screen.BROWSECHANNELS;
  }

  getChatName(chat : chat) : string
  {
    if (!chat.isDirect) //if it isn't a direct (private with 2 users) chat, return the name of the chat (which is the name of the channel
      return chat.name;
    for (let i = 0; i < chat.users_id.length; i++) //if it is a direct chat, return the name of the other user
    {
      if (chat.users_id[i] != this.services.userService.getUser().id)
        return chat.users_name[i];
    }
    return "error";
  }

  getNumberOfUsersLabel(chat : chat) : string{
    return chat.users_id.length.toString() + ' ' + (chat.users_id.length > 1 ? 'users' : 'user');
  }

  getChannelIcon(chat : chat) : string
  {
    if (chat.isDirect)
      return "Direct"
    if (chat.isPrivate)
      return "Private"
    return "Public"
  }

  public getChatList()
  {

       return this.services.chatListService.getChatList();
  }

  public isNotEmpty() : boolean
  {
      let chatList = this.services.chatListService.getChatList();
      if (chatList)
        return chatList.length > 0;
      return false;
  }

  public isUndefined() : boolean
  {
    return this.services.chatListService.getChatList() == undefined;
  }

  public openChat = (chatId : number) =>
  {
    this.navService.navigateToId('msg_input/chat/chat/' + chatId)
  }

  naviguate = (id: string) => { this.navService.keyService.isKeysMutted() ? null : this.navService.navigateToId(id); }
  press(id: string): void { this.navService.keyService.press({id: id}, true); }

}
