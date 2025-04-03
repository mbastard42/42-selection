import { Component } from '@angular/core';
import { NavService } from 'src/app/services/nav/nav.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

    constructor(private navService : NavService) {
      const previus = this.navService.head?.prev?.route
      this.navService.setElem({id: 'quick_game/nav', down: 'quick_profile/nav', next: 'classic_game/game'})
      this.navService.setElem({id: 'classic_game/game', prev: previus})

      this.navService.setElem({id: 'quick_profile/nav', down: 'quick_friend/nav', up: 'quick_game/nav', next: 'profile_friendlist/profile'})
      this.navService.setElem({id: 'profile_friendlist/profile', prev: previus})
    
      this.navService.setElem({id: 'quick_friend/nav', up: 'quick_profile/nav', down: 'quick_chat/nav', next: 'friend_search/friend'})
      this.navService.setElem({id: 'friend_search/friend', prev: previus})
    
      this.navService.setElem({id: 'quick_chat/nav', up: 'quick_friend/nav', down: 'quick_settings/nav', next: 'nav_mychat/chat'})
      this.navService.setElem({id: 'nav_mychat/chat', prev: previus})
    
      this.navService.setElem({id: 'quick_settings/nav', up: 'quick_chat/nav'})
    }

    isSelected(id : string) : boolean { return this.navService.isSelected(id) }

    naviguate = (id: string) =>
    {
      this.navService.navigateToId(id);
    }

    press(id: string)
    {
      this.navService.keyService.press({id: id}, true);
    }
  
}
