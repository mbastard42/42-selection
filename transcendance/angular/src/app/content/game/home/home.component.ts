import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavService } from 'src/app/services/nav/nav.service';

@Component({

    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']

}) export class HomeComponent {

    constructor(public authService: AuthService, private navService: NavService) {

        this.navService.setElem({id: 'classic_game/game', right: 'power_game/game', left: 'solo_game/game', next: 'play_game/game/pong', prev: 'menu_game/'});
        this.navService.setElem({id: 'power_game/game', right: 'solo_game/game', left: 'classic_game/game', next: 'play_game/game/pong-special', prev: 'menu_game/'});
        this.navService.setElem({id: 'solo_game/game', right: 'classic_game/game', left: 'power_game/game', prev: 'menu_game/'});
        this.navService.setDefaultElem('classic_game', '/game');
    }

    naviguate = (id: string) => { this.navService.navigateToId(id); }
    press(id: string) { this.navService.keyService.press({id: id}, true); }

    isLogIn() { return this.authService.isLogIn(); }

    isSelected(id: string): boolean { return this.navService.isSelected(id); }
}
