import { Component } from '@angular/core';

import { NavService } from 'src/app/services/nav/nav.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { NotificationsService } from 'src/app/services/notifService/notifications.service';
import { RootingService } from 'src/app/services/rooting/rooting.service';

@Component({

    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']

}) export class LoginComponent {
    
    email : string = "";
    password : string = "";
    
    TFACode : string = "";
    TFAneeded = false;
    completeInfos = false;
    
    constructor(public navService: NavService, public authService : AuthService, public rootService: RootingService, public userService: UserService, private readonly notifService: NotificationsService ) {

        this.navService.setElem({id: 'login_email/login', down: 'login_password/login', prev: 'menu_login/', nextBehavior: this.enterEmail});
        this.navService.setElem({id: 'login_password/login', up: 'login_email/login', down: 'login_done/login', prev: 'menu_login/', nextBehavior: this.enterPassword});
        this.navService.setElem({id: 'login_done/login', down: 'login_42/login',up: 'login_password/login', prev: 'menu_login/', next:'menu_game/', nextBehavior: this.logIn});
        this.navService.setElem({id: 'login_42/login', up: 'login_done/login', right: 'login_gotoregister/login', prev: 'menu_login/', nextBehavior: this.logInWith42Intra});
        this.navService.setElem({id: 'login_gotoregister/login', up: 'login_done/login', left: 'login_42/login', next: 'register_email/login/register', prev: 'menu_login/'});
        this.navService.setDefaultElem('login_email', '/login');
    };

    setTFAElements() {

        this.navService.setElem({id: 'login_password/login', up: 'login_email/login', down: 'login_TFA/login', prev: 'menu_login/', nextBehavior: this.enterPassword});
        this.navService.setElem({id: 'login_TFA/login', up: 'login_password/login', down: 'login_done/login', prev: 'menu_login/', nextBehavior: this.enterTFA});
        this.navService.setElem({id: 'login_done/login', down: 'login_42/login',up: 'login_TFA/login', prev: 'menu_login/', next:'menu_game/', nextBehavior: this.logIn});
    }

    naviguate = (id: string) => { this.navService.keyService.isKeysMutted() ? null : this.navService.navigateToId(id); }
    press(id: string): void { this.navService.keyService.press({id: id}, true); }

    isLogin = () => { return this.authService.islog; }
    isSelected(id: string) : boolean { return this.navService.isSelected(id); }

    enterEmail = () => {  

        this.navService.keyService.usingKeyboard(this.email, 'Enter', 0, () => { this.email = this.email == '_' ? '' : this.email; });
        this.email = this.email == '' ? '_' : this.email;
        this.navService.keyService.valueUpdate$?.subscribe((newValue) => { 
            if (this.navService.keyService.inputId == 0) {
                this.email = newValue;
                this.email = this.email == '' ? '_' : this.email;
            }
        });
    }

    enterTFA = () => {

        this.navService.keyService.usingKeyboard(this.TFACode, 'Enter', 2, () => { this.TFACode = this.TFACode == '_' ? '' : this.TFACode; });
        this.TFACode = this.TFACode == '' ? '_' : this.TFACode;
        this.navService.keyService.valueUpdate$?.subscribe((newValue) => { 
            if (this.navService.keyService.inputId == 2) {
                this.TFACode = newValue;
                this.TFACode = this.TFACode == '' ? '_' : this.TFACode;
            }
        });
    }

    enterPassword = () => {

        this.navService.keyService.usingKeyboard(this.password, 'Enter', 1, () => { this.password = this.password == '_' ? '' : this.password; });
        this.password = this.password == '' ? '_' : this.password;
        this.navService.keyService.valueUpdate$?.subscribe((newValue) => { 
            if (this.navService.keyService.inputId == 1) {
                this.password = newValue;
                this.password = this.password == '' ? '_' : this.password;
            }
        });
    }

    logInWith42Intra = async () => { const url = await this.authService.open42IntraURL(); }

    logIn = async () => {

        this.navService.keyService.setKey({mute: true});
        const res = await this.authService.logIn(this.email, this.password, this.TFACode);
        if (res == 200)
            this.navService.next();
        else if (res == 201) {
            this.TFAneeded = true;
            this.setTFAElements();
        } else if (res == 202)
            this.navService.navigateToId('completeInfo_done/login/info');
        else if (res == 400)
            this.notifService.addNotification("Login failed - request to server failed");
        else if (res == 104)
            this.notifService.addNotification("Login failed - socket connection failed");
        else if (res == 404)
            this.notifService.addNotification("Login failed - invalid credentials");
        else if (res == 410)
            this.notifService.addNotification("Login failed - invalid 2FA code");
        else
            this.notifService.addNotification("Login failed - unknown error code " + res);
        this.navService.keyService.setKey({mute: false});
    }
}
