import { Component } from '@angular/core';
import { NavService } from 'src/app/services/nav/nav.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { NotificationsService } from 'src/app/services/notifService/notifications.service';

@Component({

    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']

}) export class MenuComponent{

    constructor(private navService : NavService, private authService: AuthService, private userService: UserService, private notifService: NotificationsService) { this.buildMenu(); }

    naviguate = (id: string) => { this.navService.navigateToId(id); }
    press(id: string) { this.navService.keyService.press({id: id}, true); }

    buildMenu = () => {

        this.authService.isLogIn() ? this.buildConnectedMenu() : this.buildNotConnectedMenu();
        this.navService.setDefaultElem('menu_game', '/');
    }

    buildNotConnectedMenu = () => {

        this.navService.setElem({id: 'menu_game/', down: 'menu_login/', next: 'classic_game/game', nextBehavior: this.naviguateToGame});
        this.navService.setElem({id: 'menu_login/', up: 'menu_game/', down: 'menu_settings/', next: 'login_email/login'});
        this.navService.setElem({id: 'menu_settings/', up: 'menu_login/', down: 'menu_settings/', next: 'title/settings'});
    }

    buildConnectedMenu = () => {

        this.navService.setElem({id: 'menu_game/', down: 'menu_settings/', next: 'classic_game/game', nextBehavior: this.naviguateToGame});
        this.navService.setElem({id: 'menu_settings/', up: 'menu_game/', down: 'menu_logout/', next: 'title/settings'});
        this.navService.setElem({id: 'menu_logout/', up: 'menu_settings/', next: 'menu_login/', nextBehavior: this.logOut});
    }

    logOut = async () => {

        await this.authService.logOut();
        this.navService.next();
        this.buildMenu();
    }

    getUsername() { return this.userService.getUser().name }

    isLog() { return this.authService.isLogIn(); }

    naviguateToGame = () => { this.authService.isLogIn() ? this.navService.next() : this.notifService.addNotification("You must be log to play", 2); }

    isSelected(id : string) : boolean { return this.navService.isSelected(id) }

    isLogged() : boolean { return this.authService.isLogIn() }
}