import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RequestIncludes } from 'src/app/network/includes';
import { ServiceIncludes } from 'src/app/services/includes';
import { NavService } from 'src/app/services/nav/nav.service';

class friend
{
  name: string;
  status: string;
  constructor(name: string, status: string)
  {
    this.name = name;
    this.status = status;
  }
}

@Component({
  selector: 'app-friendlist',
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.css']
})
export class FriendlistComponent {
  friendList: Array<friend> = [];

  constructor(private readonly request : RequestIncludes, public service : ServiceIncludes, private rooter: Router, private readonly navService: NavService) {
    this.navService.setElem({id: 'friend_search/friend', next: 'search_input/user-search'});

    this.navService.setDefaultElem('friend_search', '/friend');
    this.start();
  }

  async start()
  {
    await this.updateFriendList();
    this.navService.setArrayElem({id: 'friend_number?', route: '/friend', array: this.friendList, before: 'friend_search/friend'});
    this.friendList.forEach((friend, index) => {
      this.navService.setElem({id: 'friend_number?' + index + '/friend', right: 'friendchat_number?' + index + '/friend', nextBehavior: () => {this.openFriendProfile(friend.name)}});
      this.navService.setElem({id: 'friendchat_number?' + index + '/friend', left: 'friend_number?' + index + '/friend', nextBehavior: () => {this.openChat(friend.name)}});
    });
  }

  isSelected(id: string)
  {
    return this.navService.isSelected(id);
  }

  getFriendIndex(friend : friend)
  {
    return this.friendList.indexOf(friend);
  }

  async updateFriendList()
  {
    const res = await this.request.friendRequest.getFriendList();
    if (res)
    {
      this.friendList = [];
      for (let i = 0; i < res.list.length; i++)
        this.friendList.push(new friend(res.list[i], this.getStatusLabel(res.status[i])));
    }
  }

  openFriendProfile = (username: string) =>
  {
    this.navService.setElem({id: 'status_button/profile/other/' + username, prev: 'friend_search/friend'});
    this.navService.navigateToId("status_button/profile/other/" + username);
  }

  getStatusLabel(status: number) : string
  {
    switch (status)
    {
      case -1:
        return "Hors ligne";
      case 0:
        return "En ligne";
      case 1:
        return "En conversation";
      case 2:
        return "En partie";
      default:
        return "Erreur";
    }
  }

  getStatusColor(status : string)
  {
    switch(status)
    {
      case "Hors ligne":
          return "red"
      case "En ligne":
          return "green"
      case "En conversation":
          return "cyan"
      case "En partie":
          return "blue"
      default:
          return "red"
    }
  }

  async getUserId(name: string) : Promise<number>
  {
    const res = await this.request.userRequest.getUserIdFromUsername(name);
    if (res)
      return res;
    return -1;
  }

  async getChatId(userId : number) : Promise<number>
  {
    const res = await this.request.chatRequest.getDirectChatId(userId)
    if (res)
      return res.id;
    return -1;
  }

  async openChat(friendName: string)
  { 
    this.getUserId(friendName).then((friendId) => {
      this.getChatId(friendId).then((chatId) => {
        if (chatId != -1)
        {
          this.navService.setElem({id: "msg_input/chat/chat/" + chatId, prev: 'friend_number?' + this.friendList.indexOf(this.friendList.find(friend => friend.name == friendName)!) + '/friend'});
          this.navService.navigateToId("msg_input/chat/chat/" + chatId);
        }
        else
          alert("Error while opening chat");
      });
    });
  }

  FriendListEmpty()
  {
    return this.friendList.length == 0
  }

  getFriendList()
  {
    return this.friendList;
  }



  naviguate = (id: string) => { this.navService.keyService.isKeysMutted() ? null : this.navService.navigateToId(id); }
  press(id: string): void {this.navService.keyService.press({id: id}, true);}

}
