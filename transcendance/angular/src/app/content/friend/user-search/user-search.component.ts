import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/class/user';
import { UserRequest } from 'src/app/network/user';
import { ServiceIncludes } from 'src/app/services/includes';
import { NavService } from 'src/app/services/nav/nav.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent {
  findUsers : Array<User> = [];

  avatarArray : Array<string> = [];

  inputText : string = "";

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  @ViewChild('userDiv') userDiv!: ElementRef;

  constructor(private readonly userRequest: UserRequest, private service : ServiceIncludes, private navService: NavService, private router: Router) {
    this.navService.setElem({id: 'search_input/user-search', left: 'search_close/user-search', prev: 'friend_search/friend', down: 'search_close/user-search', nextBehavior: this.enterMessage});
    this.navService.setElem({id: 'search_close/user-search', right: 'search_input/user-search', up: 'search_input/user-search', next: 'friend_search/friend'});
  
    this.navService.setDefaultElem('search_input', '/user-search');
  }

  ScrollDown = () => {
    const messageDivHeight = this.userDiv.nativeElement.offsetHeight;
    if (this.scrollContainer)
      this.scrollContainer.nativeElement.scrollTop += messageDivHeight - 1;
  }

  ScrollUp = () => {
    const messageDivHeight = this.userDiv.nativeElement.offsetHeight;
    if (this.scrollContainer)
      this.scrollContainer.nativeElement.scrollTop -= messageDivHeight - 1;
  }

  enterMessage = () => {
    this.navService.keyService.usingKeyboard(this.inputText, 'Enter', 0,() => {
      if (this.inputText == '_')
          this.inputText = '';
    });
    if (this.inputText == '')
        this.inputText = '_';
    this.navService.keyService.valueUpdate$?.subscribe((newValue) => { 
        if (this.navService.keyService.inputId == 0)
            this.inputText = newValue;
        this.search();
    });
  }

  getAvatarOfUser(id: string)
  {
    const index = this.getUserIndexFromArray(id);
    if (index != -1)
      return this.avatarArray[index];
    return "";
  }

  setElementOfUsers()
  {

    for (let i = 0; i < this.findUsers.length; i++)
    {
        this.navService.setElem({
          id: 'find_user_' + i + '/user-search', 
          up : i == 0 ?
            'search_input/user-search' :
            'find_user_' + (i - 1) + '/user-search',
          down: i == this.findUsers.length - 1 ?
            'find_user_' + i + '/user-search' :
            'find_user_' + (i + 1) + '/user-search',
          next: 'status_button/profile/other/' + this.findUsers[i].name,
          nextBehavior: () => {this.navService.setElem({id: 'status_button/profile/other/' + this.findUsers[i].name, prev: 'search_input/user-search'}); this.navService.next();},
          downBehavior: () => {this.ScrollDown(); this.navService.moveDown()},
          upBehavior: () => {this.ScrollUp(); this.navService.moveUp()}
        });
    }
    if (this.findUsers.length != 0)
      this.navService.setElem({id: 'search_input/user-search', down: 'find_user_0/user-search'});
    else
      this.navService.setElem({id: 'search_input/user-search', down: 'search_close/user-search'});
  }

  getNavIdOfUser(id: string)
  {
    return 'find_user_' + this.getUserIndexFromArray(id);
  }

  getUserIndexFromArray(id: string)
  {
    return this.findUsers.findIndex((value) => value.name == id);
  }


  isSelected(id: string)
  {
    return this.navService.isSelected(id);
  }

  search = async () =>
  {
    const users = await this.userRequest.searchUsersFromName(this.inputText)
    if (users)
    {
      this.findUsers = [];
      this.avatarArray = [];
      for (let i = 0; i < users.length; i++)
        if (users[i].name.length > 0 && users[i].name != this.service.userService.getUser().name)
          this.findUsers.push(users[i]);
      this.setElementOfUsers();
      for (let i = 0; i < this.findUsers.length; i++)
      {
        const avatar = await this.userRequest.getAvatar(this.findUsers[i].id);
        if (avatar)
          this.avatarArray.push(avatar);
        else
          this.avatarArray.push("");
      }
    }
  }

  goToFriendList()
  {
    const elem = this.navService.getElem('search_close/user-search');
    if (elem && elem.nextBehavior)
      elem.nextBehavior();
  }

  naviguate = (id: string) => { this.navService.keyService.isKeysMutted() ? null : this.navService.navigateToId(id); }
  press(id: string): void {this.navService.keyService.press({id: id}, true);}
}
