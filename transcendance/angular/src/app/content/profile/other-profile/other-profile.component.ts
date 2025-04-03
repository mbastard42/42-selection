import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/class/user';
import { RequestIncludes } from 'src/app/network/includes';
import { ServiceIncludes } from 'src/app/services/includes';
import { NavService } from 'src/app/services/nav/nav.service';
import { SocketService } from 'src/app/services/socket/socket.service';
@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.css']
})
export class OtherProfileComponent {
  inputName : string = "";

  user : User = new User();
  status : number = 0; // 0 = not friend, 1 = friend, 2 = already sent request, 3 = already received request
  isblocked : boolean = false;
  label : string = "Add to friend";

  userAvatar : string = "";

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;


  constructor(
    private readonly request : RequestIncludes,
    private readonly socketService: SocketService,
    public service : ServiceIncludes,
    private rooter : ActivatedRoute,
    private navService: NavService) {
  }

  async ngOnInit()
  {
    await this.start();
    const username = this.rooter.snapshot.paramMap.get('username');
    if (username)
    {
      this.inputName = username;
      await this.updateUser();
      await this.updateStatus();
      await this.updateIsBlocked();
      await this.updateUserAvatar();
      this.setElements(username);

    }
  }

  async start()
  {
    // const res = await this.service.authService.logIn("mm@mm.mm", "mmmmm")
  }

  //------------------------------------------ELEMENTS-------------------------------------------

  profileRoute(id : string){
    return id + '/profile/other/' + this.rooter.snapshot.paramMap.get('username');
  }

  setElements(username: string)
  {
    this.navService.setElem({id: 'status_button/profile/other/' + username, right: 'block_button/profile/other/' + username, down: 'score_div/profile/other/' + username, nextBehavior: this.buttonAction});
    this.navService.setElem({id: 'block_button/profile/other/' + username, left: 'status_button/profile/other/' + username, down: 'score_div/profile/other/' + username, prev: this.navService.head?.prev?.route, nextBehavior: this.blockButtonAction});
    this.navService.setElem({id: 'score_div/profile/other/' + username, up: 'status_button/profile/other/' + username, prev: this.navService.head?.prev?.route, downBehavior: this.scrollDownScoreDiv, upBehavior: this.scrollUpScoreDiv});
    if (this.isblocked)
      this.setBlockedElement();
    else if (this.isFriend())
      this.setFriendElement();
  }

  setBlockedElement()
  {
    this.navService.setElem({id: 'block_button/profile/other/' + this.inputName, left: 'block_button/profile/other/' + this.inputName, right:'block_button/profile/other/' + this.inputName, nextBehavior: this.blockButtonAction});
    this.navService.setElem({id: 'score_div/profile/other/' + this.inputName, up: 'block_button/profile/other/' + this.inputName});
  }

  setFriendElement()
  {
    this.navService.setElem({id: 'status_button/profile/other/' + this.inputName, right: 'chat_button/profile/other/' + this.inputName})
    this.navService.setElem({id: 'chat_button/profile/other/' + this.inputName, left: 'status_button/profile/other/' + this.inputName, right: 'block_button/profile/other/' + this.inputName ,down: 'score_div/profile/other/' + this.inputName, nextBehavior: this.openChat});
    this.navService.setElem({id: 'block_button/profile/other/' + this.inputName, left: 'chat_button/profile/other/' + this.inputName});
  }

  //------------------------------------------ACTION-------------------------------------------

  scrollDownScoreDiv = () =>
  {
    this.scrollContainer.nativeElement.scrollTop += 30;
  }

  scrollUpScoreDiv = () =>
  {
    if (this.scrollContainer.nativeElement.scrollTop > 0)
      this.scrollContainer.nativeElement.scrollTop -= 30;
    else
      this.navService.moveUp();
  }

  isSelected(id: string) : boolean {
    return this.navService.isSelected(id);
  }

  openStat()
  {
    this.service.rootingService.goToScore(this.user.name)
    // this.service.overlayService.newOverlay(overlayScreen.SCORE, this.user.name);
  }

  openChat = async () =>
  {
    const chat = await this.getChatFromServer();
    if (chat)
    {
      this.navService.setElem({id: "msg_input/chat/chat/" + chat.id, prev: "chat_button/profile/other/" + this.inputName});
      this.navService.navigateToId("msg_input/chat/chat/" + chat.id);
    }
    else
      this.service.notifService.addNotification("Impossible d'ouvrir la conversation");
  }

   buttonAction = async () =>
  {
    if (this.isFriend())
      await this.removeFromFriend();
    else if (this.isAlreadySentRequest())
      await this.cancelRequest();
    else if (this.isAlreadyReceivedRequest())
      await this.addToFriend();
    else if (this.isNotFriend())
      await this.addToFriend();
    await this.updateUser();
    await this.updateStatus();
    this.setElements(this.inputName);
  }

  //--------------------------------REQUEST-------------------------------------------

  blockButtonAction = async () =>
  {
    if (this.isUserBlocked())
      await this.unblockUser();
    else
      await this.blockUser();
    await this.updateIsBlocked();
    this.setElements(this.inputName);
  }

  async blockUser()
  {
    const res = await this.request.userRequest.blockUser(this.service.userService.getUser().id, this.user.id);
    if (res)
    {
      if (res == 404)
        alert("User not found")
      else if (res == 201)
        alert("User already blocked")
      else if (res == 403)
        alert("You can't block yourself")
    }
    await this.updateIsBlocked();
  }

  async unblockUser()
  {
    const res = await this.request.userRequest.unblockUser(this.service.userService.getUser().id, this.user.id);
    if (res)
    {
      if (res == 404)
        alert("User not found")
      else if (res == 201)
        alert("User isn't blocked")
    }
    await this.updateIsBlocked();
  }

  async updateIsBlocked()
  {
    const res = await this.request.userRequest.getBlockedList(this.service.userService.getUser().id);
    if (res)
    {
      this.isblocked = res.includes(this.user.id)
    }
  }

  async updateUser()
  {
    const user = await this.request.userRequest.getUserFromUsername(this.inputName)
    if (user)
      this.user = user;
  }

  async updateStatus()
  {
    const res = await this.request.friendRequest.getFriendshipStatus(this.user.id)
    if (res != undefined)
    {
      this.status = res;
    }
    this.updateLabel();
  }

  async updateUserAvatar()
  {
    const res = await this.request.userRequest.getAvatar(this.user.id);
    if (res)
    {
      this.userAvatar = res;
    }
  }

  addToFriend()
  {
    const res = this.socketService.addFriendRequest(this.user.id);
  }

  removeFromFriend()
  {
    this.socketService.removeFriend(this.user.id);
  }

  async cancelRequest()
  {
    const res = this.socketService.removeFriendRequest(this.user.id);
  }

  updateLabel()
  {
    if (this.isFriend())
      this.label = "Remove friend";
    else if (this.isAlreadySentRequest())
      this.label = "Cancel request";
    else if (this.isAlreadyReceivedRequest())
      this.label = "Accept friend";
    else if (this.isNotFriend())
      this.label = "Add to friend";

  }

  //-----------------------------GETTER-----------------------------------


  async getChatFromServer()
  {
    const chat = await this.request.chatRequest.getDirectChatId(this.user.id);
    return chat; 
  }

  getAvatar()
  {
    return this.userAvatar;
  }

  isNotFriend()
  {
    return this.status == 0;
  }

  isUserBlocked()
  {
    return this.isblocked;
  }

  isFriend()
  {
    return this.status == 1;
  }

  isAlreadySentRequest()
  {
    return this.status == 2;
  }

  isAlreadyReceivedRequest()
  {
    return this.status == 3;
  }

  getInputName()
  {
    return this.rooter.snapshot.paramMap.get('username')!;
  }

  getName()
  {
    return this.user.name;
  }

  getEmail()
  {
    return this.user.email;
  }

  naviguate = (id: string) => { this.navService.keyService.isKeysMutted() ? null : this.navService.navigateToId(id); }
  press(id: string): void {this.navService.keyService.press({id: id}, true);}
}
