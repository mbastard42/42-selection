import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { message } from 'src/app/class/message';
import { ChatRequest } from 'src/app/network/chat';
import { FriendRequest } from 'src/app/network/friend';
import { PongRequest } from 'src/app/network/pong';
import { UserRequest } from 'src/app/network/user';
import { ServiceIncludes } from 'src/app/services/includes';
import { NavService } from 'src/app/services/nav/nav.service';
import { SocketService } from 'src/app/services/socket/socket.service';

enum screen {CHAT, USERLIST, INVITFRIEND, SETTINGS}


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnDestroy, OnInit{


  actualScreen : screen = screen.CHAT;

  keepScrollToBottom : boolean = true;

  writingMessage : string = "";

  blockedList : Array<number> = [];

  friendList : Array<string> = [];

  chatNewName : string = "";

  chatNewPassword : string = "";

  @ViewChild('messageDiv') messageDiv!: ElementRef;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  constructor( public chatRequest: ChatRequest,
      private pongRequest: PongRequest,
      private userRequest: UserRequest,
      private friendRequest: FriendRequest ,
      public service : ServiceIncludes, 
      private socketService : SocketService,
      private rooter: ActivatedRoute,
      private navService: NavService
    ) {
    this.setChatScreenElements();
    this.setUserScreenElements();
    this.setSettingsScreenElements();
    this.updateUserBlockList();
   }

   ngOnDestroy(): void {
    this.socketService.leaveChat(this.service.chatSerivce.getChatInfos().id)
   }

   ngOnInit(): void {
    const channelId = this.rooter.snapshot.paramMap.get('channelId');
    if (channelId)
      this.socketService.joinChat(parseInt(channelId));
   }

  chatRoute(id : string)
  {
    return id + '/chat/chat/' + this.rooter.snapshot.paramMap.get('channelId');
  }

  getUsernameIndex(username: string) : number
  {
    const users = this.getUsernameList().filter((username) => this.service.userService.getUser().name != username);
    return users.findIndex((name) => name == username);
  }

  getFriendnameIndex(username: string) : number
  {
    const users = this.getFriendList();
    return users.findIndex((name) => name == username);
  }

  getUsernameBanIndex(username: string) : number
  {
    const users = this.getBanUsernameList();
    return users.findIndex((name) => name == username);
  }
  
  async updateUserBlockList()
  {
    const list = await this.userRequest.getBlockedList(this.service.userService.getUser().id);
    if (list)
      this.blockedList = list;
  }


  // -----------------------ELEMENTS------------------------

  enterMessage = () => {
    this.navService.keyService.usingKeyboard(this.writingMessage, 'Enter', 0, () => {this.addMessage(this.writingMessage); this.writingMessage = ""});
    this.navService.keyService.valueUpdate$?.subscribe((newValue) => { 
        if (this.navService.keyService.inputId == 0)
            this.writingMessage = newValue;
    });
  }
  enterNewName = () => {
    if (!this.isOwner() && !this.isAdmin())
        return ;
    this.navService.keyService.usingKeyboard(this.chatNewName, 'Enter', 0);
    this.navService.keyService.valueUpdate$?.subscribe((newValue) => { 
        if (this.navService.keyService.inputId == 0)
          this.chatNewName = newValue;
    });
  }
  enterPassword = () => {
    if (!this.isOwner() && !this.isAdmin())
        return ;
    this.navService.keyService.usingKeyboard(this.chatNewPassword, 'Enter', 1);
    this.navService.keyService.valueUpdate$?.subscribe((newValue) => { 
        if (this.navService.keyService.inputId == 1)
            this.chatNewPassword = newValue;
    });
  }

  isSelected(elem: string) : boolean
  {
    return this.navService.isSelected(elem);
  }
  isUserSelected(username: string) : boolean
  {
    return this.navService.isSelected('user?' + this.getUsernameIndex(username) + '_userlist') ||
    this.navService.isSelected('userKick?' + this.getUsernameIndex(username) + '_userlist') ||
    this.navService.isSelected('userBan?' + this.getUsernameIndex(username) + '_userlist') ||
    this.navService.isSelected('userMute?' + this.getUsernameIndex(username) + '_userlist') ||
    this.navService.isSelected('userAdmin?' + this.getUsernameIndex(username) + '_userlist');
  }


  setChatScreenElements()
  {
    this.navService.setElem({id: this.chatRoute('msg_input'), left: this.chatRoute('defi_button'), up: this.chatRoute('messages_case'), nextBehavior: this.enterMessage, prev: 'nav_mychat/chat'});
    this.navService.setElem({id: this.chatRoute('defi_button'), right: this.chatRoute('msg_input'), up: this.chatRoute('messages_case'), nextBehavior: () => this.addMessage('**/DUEL/**'), prev: 'nav_mychat/chat'});

    this.navService.setElem({id: this.chatRoute('messages_case'), down: this.chatRoute('msg_input'), up: this.chatRoute('userlist_open'), nextBehavior: this.selectFirstMessage, prev: 'nav_mychat/chat'});

    this.navService.setElem({id: this.chatRoute('userlist_open'), next: this.chatRoute('close_userlist'), right: this.chatRoute('settings_open'), down: this.chatRoute('messages_case'), nextBehavior: this.openUserList, rightBehavior: () => {this.isOwner() ? this.navService.moveRight() : null}, prev: 'nav_mychat/chat'})
    this.navService.setElem({id: this.chatRoute('settings_open'), next: this.chatRoute('close_settings'), down: this.chatRoute('messages_case'), left: this.chatRoute('userlist_open'),nextBehavior: this.openSettings, prev: 'nav_mychat/chat'})
  
    this.navService.setDefaultElem('msg_input', '/chat/chat/' + this.rooter.snapshot.paramMap.get('channelId'));
  }
  setUserScreenElements()
  {
    this.navService.setElem({id: this.chatRoute('close_userlist'), next:  this.chatRoute('msg_input'), right: this.chatRoute('invitefriend_userlist'), nextBehavior: this.openChat, rightBehavior: () => {this.isOwner() || this.isAdmin() ? this.navService.moveRight() : null}})      
    this.navService.setElem({id: this.chatRoute('invitefriend_userlist'), left: this.chatRoute('close_userlist'), nextBehavior: this.openInviteFriendList, next: this.chatRoute('close_invitefriend')})
    this.navService.setElem({id: this.chatRoute('close_invitefriend'), next:  this.chatRoute('close_userlist'), nextBehavior: this.openUserList})

  }
  setSettingsScreenElements()
  {
    this.navService.setElem({id: this.chatRoute('close_settings'), down: this.chatRoute('input-change_name'), next: this.chatRoute('msg_input'), nextBehavior: this.openChat})
    this.navService.setElem({id: this.chatRoute('input-change_name'), up: this.chatRoute('close_settings'), down: this.chatRoute('done-change_name'), nextBehavior: this.enterNewName})
    this.navService.setElem({id: this.chatRoute('done-change_name'), up: this.chatRoute('input-change_name'), down: this.chatRoute('input-change_password'), nextBehavior: this.updateChatName})
    this.navService.setElem({id: this.chatRoute('input-change_password'), up: this.chatRoute('done-change_name'), down: this.chatRoute('done-change_password'), nextBehavior: this.enterPassword})
    this.navService.setElem({id: this.chatRoute('done-change_password'), up: this.chatRoute('input-change_password'), down: this.chatRoute('change_privacy'), nextBehavior: this.updateChatPassword})
    this.navService.setElem({id: this.chatRoute('change_privacy'), up: this.chatRoute('done-change_password'), nextBehavior: this.updateIsPrivate})
  }

  updateUserListElements()
  {
    const users = this.getUsernameList().filter((username) => this.service.userService.getUser().name != username);

    this.navService.setElem({id: this.chatRoute('close_userlist'), down: this.chatRoute('close_userlist')})      

    this.navService.setArrayElem({id: 'user?', route: '_userlist/chat/chat/' + this.getChatInfos().id, array: users, before: this.chatRoute('close_userlist')})
    users.forEach((username, index) => {
      if (this.isAdmin() || this.isOwner())
      {
        this.navService.setElem({id: 'user?' + index + '_userlist/chat/chat/' + this.getChatInfos().id, next: 'status_button/profile/other/' + username, right: 'userKick?' + index + '_userlist/chat/chat/' + this.getChatInfos().id})
        this.navService.setElem({id: 'userKick?' + index + '_userlist/chat/chat/' + this.getChatInfos().id, nextBehavior: () => this.kickUser(username), right: 'userBan?' + index + '_userlist/chat/chat/' + this.getChatInfos().id, left: 'user?' + index + '_userlist/chat/chat/' + this.getChatInfos().id})
        this.navService.setElem({id: 'userBan?' + index + '_userlist/chat/chat/' + this.getChatInfos().id, nextBehavior: () => this.banUser(username), right: 'userMute?' + index + '_userlist/chat/chat/' + this.getChatInfos().id, left: 'userKick?' + index + '_userlist/chat/chat/' + this.getChatInfos().id})
        this.navService.setElem({id: 'userMute?' + index + '_userlist/chat/chat/' + this.getChatInfos().id, nextBehavior: () => this.muteUser(username), right: this.isOwner() ? 'userAdmin?' + index + '_userlist/chat/chat/' + this.getChatInfos().id : undefined, left: 'userBan?' + index + '_userlist/chat/chat/' + this.getChatInfos().id})
      }
      else
        this.navService.setElem({id: 'user?' + index + '_userlist/chat/chat/' + this.getChatInfos().id, next: 'status_button/profile/other/' + username})
      if (this.isOwner())
        this.navService.setElem({id: 'userAdmin?' + index + '_userlist/chat/chat/' + this.getChatInfos().id, nextBehavior: () => this.updateAdmin(username), left: 'userMute?' + index + '_userlist/chat/chat/' + this.getChatInfos().id})
    });

    //----------------------BAN LIST----------------------

    if (this.service.chatSerivce.blockedNamesList.length > 0) //Link users with banned Users
      this.navService.setElem({id: 'user?' + users[users.length - 1] + '_userlist/chat/chat/' + this.getChatInfos().id, down:  'user?0_userBanlist/chat/chat/' + this.getChatInfos().id})

    this.navService.setArrayElem({id: 'user?', route: '_userBanlist/chat/chat/' + this.getChatInfos().id, array: this.service.chatSerivce.blockedNamesList, before: this.chatRoute('close_userlist')})
    this.service.chatSerivce.blockedNamesList.forEach((username, index) => {
      if (this.isAdmin() || this.isOwner())
        this.navService.setElem({id: 'user?' + index + "_userBanlist/chat/chat/" + this.getChatInfos().id, right: 'userUnban?' + index + "_userBanlist/chat/chat/" + this.getChatInfos().id, next: 'status_button/profile/other/' + username})
        this.navService.setElem({id: 'userUnban?' + index + "_userBanlist/chat/chat/" + this.getChatInfos().id, left: 'user?' + index + "_userBanlist/chat/chat/" + this.getChatInfos().id, nextBehavior: () => this.unBanUser(username)})
    })

  }
  updateFriendListElements()
  {
    this.navService.setArrayElem({id: 'friend?', route: '_invitefriend/chat/chat/' + this.getChatInfos().id, array: this.getFriendList(), before: this.chatRoute('close_invitefriend')})
    this.getFriendList().forEach((username, index) => {
      this.navService.setElem({id: 'friend?' + index + '_invitefriend/chat/chat/' + this.getChatInfos().id, next: this.chatRoute('msg_input'), nextBehavior: () => this.inviteFriend(username)})
    });
  }
  updateMessagesListElements()
  {
    const messages = this.getMessages().filter((message) => !this.isFromBlockedUser(message.user_id));
    this.navService.setArrayElem({id: 'message?', route: '_chat/chat/chat/' + this.getChatInfos().id, array: messages, prev: this.chatRoute('msg_input')})
    messages.forEach((message, index) => {
      this.navService.setElem({id: this.chatRoute('message?' + index + '_chat'), upBehavior: () => {this.ScrollUp(); this.navService.moveUp()}, downBehavior: () => {this.ScrollDown(); this.navService.moveDown()}})
      if (this.isUserMessage(message))
        this.navService.setElem({id: this.chatRoute('message?' + index + '_chat'), nextBehavior: () => {}})
      else if (this.isCommand(message.content))
        this.navService.setElem({id: this.chatRoute('message?' + index + '_chat'), nextBehavior: () => this.getCommandFunction(message)})
    });
  }

  selectFirstMessage = () =>{
    this.updateMessagesListElements();
    this.ScrollToBottom();
    if (this.getLastMessageIndex(true) != -1)
      this.navService.navigateToId(this.chatRoute('message?' + this.getLastMessageIndex(true) + '_chat'))
  }

  // -----------------------SCROLL------------------------

  ScrollToBottom = () => {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

  ScrollDown = () => {
    const messageDivHeight = this.messageDiv.nativeElement.offsetHeight;
    if (this.scrollContainer)
      this.scrollContainer.nativeElement.scrollTop += messageDivHeight - 1;
  }

  ScrollUp = () => {
    const messageDivHeight = this.messageDiv.nativeElement.offsetHeight;
    if (this.scrollContainer)
      this.scrollContainer.nativeElement.scrollTop -= messageDivHeight - 1;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key == 'ArrowDown')
      this.ScrollDown();
    else if (event.key == 'ArrowUp')
      this.ScrollUp();
  }

  // -----------------------SETTERS------------------------


  openUserList = () =>
  {
    this.actualScreen = screen.USERLIST;
    this.updateUserListElements();
    this.navService.next();
  }

  openInviteFriendList = async () =>
  {
    const res = await this.updateFriendList();
    if (res != 200)
    {
      this.service.notifService.addNotification("You don't have any friend yet !");
      return ;
    }
    this.updateFriendListElements();
    this.actualScreen = screen.INVITFRIEND;      
    this.navService.next();
  }

  openSettings = () =>
  {
    this.actualScreen = screen.SETTINGS;
    this.navService.next();
  }

  openChat = () =>
  {
    this.actualScreen = screen.CHAT;
    this.navService.next();
    
  }

  // -----------------------MESSAGE CMD----------------------
  addMessage = async (content : string) =>
  {
    if (content.length == 0)
      return ;
    if (content.length > 80)
      this.service.notifService.addNotification("Message too long, max 80 characters");
    else
    {
      this.socketService.sendMessage(new message(0, content, this.service.userService.getUser().id, this.getChatInfos().id));
      this.writingMessage = "";
    }
  }

  removeMessage = async (msg : message) =>
  {
    this.socketService.removeMessage(msg)
    this.navService.navigateToId(this.chatRoute('msg_input'))
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  isCommand(msg: string) : boolean
  {
    if (msg == "**/DUEL/**")
      return true;
    return false;
  }

  isBlockUser(username: string)
  {
    const id = this.getIdFromUsername(username)
    if (id)
    {
      return this.blockedList.includes(id);
    }
    return false;
  }

  isFromBlockedUser(senderId: number)
  {
    return this.blockedList.includes(senderId)
  }

  getCommandLabel(cmd: message) : string
  {
    if (cmd.content == "**/DUEL/**")
      return "M'affronter en 1v1"
    return "INVALID"
  }

  getCommandFunction = async (cmd: message) =>
  {
    if (cmd.content == "**/DUEL/**")
    {
      if (cmd.user_id != this.service.userService.getUser().id)
      {
        this.acceptDuel(cmd.user_id)
        this.removeMessage(cmd);
      }
    }
    else
      alert("Invalid command");
  }

  acceptDuel = async (opponent_id : number) => {
    const response = await this.pongRequest.acceptDuel(opponent_id)
    if (response)
    {
      if (response == 404)
        alert("User isn't connected.")
      else if (response == 400)
        alert("User isn't into the conversation.")
      else if (response == 402)
        alert("User is already in a game.")
      else if (response == 200)
        console.log("response " + response)
      return response;
    }
    return 0;
  }
  // -------------------------GETTERS------------------------

  getMessageIndex(msg: message, doFilterBlocked: boolean) : number
  {
    if (doFilterBlocked)
      return this.getMessages().filter((message) => !this.isFromBlockedUser(message.user_id)).findIndex((message) => message == msg);
    return this.getMessages().findIndex((message) => message == msg);
  }

  getLastMessageIndex(doFilterBlocked: boolean) : number
  {
    if (doFilterBlocked)
      return this.getMessages().filter((message) => !this.isFromBlockedUser(message.user_id)).length - 1;
    return this.getMessages().length - 1;
  }

  inviteFriend = async (username : string) =>
  {
    const id = await this.userRequest.getUserIdFromUsername(username);
    if (!id)
    {
      alert("User not found");
      return ;
    }
    const response = await this.chatRequest.inviteFriend(this.getChatInfos().id, this.service.userService.getUser().id, id);
    if (response)
    {
      if (response == 200)
      {
        this.socketService.refreshChat(this.getChatInfos().id);
        this.openChat();
        this.navService.next();
      }
      else if (response == 400)
        alert("You are not in this conversation");
      else if (response == 401)
        alert("This user is already in the conversation");
      else if (response == 402)
        alert("You can't invite user to this conversation");
      else if (response == 403)
        alert("Selected friend is banned from this conversation");
      else if (response == 404)
        alert("Chat not found");
      else if (response == 405)
        alert("User not found");
    }
    
  }

  isAnnonce(msg: message)
  {
    return msg.user_id == -2;
  }

  isCurrentUser(username: string) : boolean
  {
    return username == this.service.userService.getUser().name;
  }

  isChatLoaded() : boolean
  {
    return this.getChatInfos().id != -1;
  }

  isInChat() : boolean
  {
    return this.actualScreen == screen.CHAT;
  }

  isInUserList() : boolean
  {
    return this.actualScreen == screen.USERLIST;
  }

  isInInviteFriend() : boolean
  {
    return this.actualScreen == screen.INVITFRIEND;
  }

  isInSettings() : boolean
  {
    return this.actualScreen == screen.SETTINGS;
  }

  isDirectChat() : boolean
  {
    return this.getChatInfos().isDirect;
  }

  isUserMessage(message : message) : boolean
  {
    return message.user_id == this.service.userService.getUser().id;
  }

  isAdmin() : boolean
  {
    return this.getChatInfos().admins_id.includes(this.service.userService.getUser().id);
  }

  isOwner = () =>
  {
    return this.getChatInfos().owner_id == this.service.userService.getUser().id;
  }

  isUserAdmin(username : string) : boolean
  {
    const id = this.getIdFromUsername(username)
    return this.getChatInfos().admins_id.includes(id);
  }

  getIdFromUsername(username : string) : number
  {
    const index = this.getChatInfos().users_name.indexOf(username);
    if (index == -1)
      return -1;
    return this.getChatInfos().users_id[index];
  }

  getUsernameList() : Array<string>
  {
    return this.getChatInfos().users_name;
  }

  getFriendList() : Array<string>
  {
    return this.friendList;
  }

  getBanUsernameList() : Array<string>
  {
    return this.service.chatSerivce.blockedNamesList;

  }

  getUserNameFromId(id : number) : string
  {
    if (id == this.service.userService.getUser().id)
      return this.service.userService.getUser().name;
    for (let i = 0; i < this.getChatInfos().users_id.length; i++)
    {
      if (this.getChatInfos().users_id[i] == id)
        return this.getChatInfos().users_name[i];
    }
    return "";
  }

  getChatName() : string
  {
    if (!this.getChatInfos().isDirect) //if it isn't a direct (private with 2 users) chat, return the name of the chat (which is the name of the channel
      return this.getChatInfos().name;
    for (let i = 0; i < this.getChatInfos().users_id.length; i++) //if it is a direct chat, return the name of the other user
    {
      if (this.getChatInfos().users_id[i] != this.service.userService.getUser().id)
        return this.getChatInfos().users_name[i];
    }
    return "error";
  }

  getChatInfos()
  {
    return this.service.chatSerivce.getChatInfos();
  }

  getMessages()
  {
    return this.service.chatSerivce.getMessages();
  }
  // -------------------------REQUESTS------------------------


  async updateFriendList() : Promise<number>
  {
    const list = await this.friendRequest.getFriendList();
    if (!list)
      return 404;
    this.friendList = list.list;
    return 200;
  }

  kickUser =  async(username: string) =>
  {
    const id = this.getIdFromUsername(username);
    if (id)
      this.socketService.kickUserFromChat(this.service.chatSerivce.getChatInfos().id, id)
  }

  banUser = async(username: string) =>
  {
    const id = this.getIdFromUsername(username);
    if (id)
    {
      this.socketService.banUserFromChat(this.service.chatSerivce.getChatInfos().id, id)
      this.navService.navigateToId(this.chatRoute('close_userlist'))
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    this.updateUserListElements();

  }

  unBanUser = async(username: string) =>
  {
    const id = await this.userRequest.getUserIdFromUsername(username);
    if (id)
    {
      this.socketService.unbanUserFromChat(this.service.chatSerivce.getChatInfos().id, id)
      this.navService.navigateToId(this.chatRoute('close_userlist'))
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    this.updateUserListElements();
  }

  muteUser = async(username: string) =>
  {
    const time = prompt("Enter the mute time in minutes (max 60)");
    const id = this.getIdFromUsername(username);
    if (id == this.service.userService.getUser().id)
      alert("You can't mute yourself");
    else if (time)
    {
      const value = await this.chatRequest.muteUser(this.getChatInfos().id, id, time);
        if (value == 200)
          alert("User muted for " + time + " minutes");
        else if (value == 404)
          alert("Chat not found");
        else if (value == 400)
          alert("Invalid mute time");
        else if (value == 401)
          alert("The user is not in this channel");
        else if (value == 402)
          alert("User already muted");
        else if (value == 403)
          alert("You can't mute this user");
    }
  }

  updateAdmin = async(username: string) =>
  {

    const index = this.getIdFromUsername(username);
    this.socketService.updateAdmin(this.getChatInfos().id, index)
  }

  updateChatName = async () =>
  {
    this.socketService.changeChatName(this.getChatInfos().id, this.chatNewName)
  }

  updateChatPassword = async () =>
  {
    this.socketService.changeChatPassword(this.getChatInfos().id, this.chatNewPassword)
  }

  updateIsPrivate = async () =>
  {
    this.socketService.changeChatPrivacy(this.getChatInfos().id, !this.getChatInfos().isPrivate)
  }

  getChannelPrivacyLabel() : string
  {
    if (this.getChatInfos().isPrivate)
      return "Private";
    return "Public";
  }

  naviguate = (id: string) => { this.navService.keyService.isKeysMutted() ? null : this.navService.navigateToId(id); }
  press(id: string): void {this.navService.keyService.press({id: id}, true);}
}
