import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavService } from 'src/app/services/nav/nav.service';
import { NotificationsService } from 'src/app/services/notifService/notifications.service';

@Component({

    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'] 

}) export class RegisterComponent {

    email : string = "";
    password1 : string = "";
    password2 : string = "";

    constructor(private navService : NavService, private authService : AuthService, private readonly notifService: NotificationsService){

        this.navService.setElem({id: 'register_email/login/register', down: 'register_password/login/register', prev: 'login_email/login', nextBehavior: this.enterEmail});
        this.navService.setElem({id: 'register_password/login/register', up: 'register_email/login/register', down: 'register_password2/login/register', prev: 'login_email/login', nextBehavior: this.enterPassword1});
        this.navService.setElem({id: 'register_password2/login/register', up: 'register_password/login/register', down: 'register_done/login/register', prev: 'login_email/login', nextBehavior: this.enterPassword2});
        this.navService.setElem({id: 'register_done/login/register', down: 'register_42/login/register',up: 'register_password2/login/register', prev: 'login_email/login', next: 'login_done/login', nextBehavior: this.register});
        this.navService.setElem({id: 'register_gotologin/login/register', up: 'register_done/login/register', left: 'register_42/login/register',  prev: 'login_email/login',next: 'login_done/login'});
        this.navService.setElem({id: 'register_42/login/register', up: 'register_done/login/register', right: 'register_gotologin/login/register',  prev: 'login_email/login', nextBehavior: this.registerWith42Intra});
        this.navService.setDefaultElem('register_email', '/login/register');
    }
  
    naviguate = (id: string) => { this.navService.keyService.isKeysMutted() ? null : this.navService.navigateToId(id); }
    press(id: string): void { this.navService.keyService.press({id: id}, true); }


    isSelected = (id : string) => { return this.navService.isSelected(id); }
    isLogin = () => { return this.authService.islog }

    register = async () => {

        if (this.password1 == this.password2) {

            this.navService.keyService.setKey({mute: true});
            const res = await this.authService.register(this.email, this.password1);
            if (res == 400)
                this.notifService.addNotification("register failed - an account with this email already exists");
            else if (res == 401)
                this.notifService.addNotification("register failed - invalid email");
            else if (res == 402)
                this.notifService.addNotification("register failed - password must be longer than 5 characters");
            else if (res == 500)
                this.notifService.addNotification("register failed - internal server error")
            else if (res == 404)
                this.notifService.addNotification("register failed - request failed")
            else if (res == 200)
                this.navService.next();
            this.navService.keyService.setKey({mute: false});
        } else
            this.notifService.addNotification("Passwords don't match");
    }

    registerWith42Intra = async () => { const url = await this.authService.open42IntraURL(); }

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

    enterPassword1 = () => {

        this.navService.keyService.usingKeyboard(this.password1, 'Enter', 2, () => { this.password1 = this.password1 == '_' ? '' : this.password1; });
        this.password1 = this.password1 == '' ? '_' : this.password1;
        this.navService.keyService.valueUpdate$?.subscribe((newValue) => { 
            if (this.navService.keyService.inputId == 2) {
                this.password1 = newValue;
                this.password1 = this.password1 == '' ? '_' : this.password1;
            }
        });
    }

    enterPassword2 = () => {

        this.navService.keyService.usingKeyboard(this.password2, 'Enter', 3, () => { this.password2 = this.password2 == '_' ? '' : this.password2; });
        this.password2 = this.password2 == '' ? '_' : this.password2;
        this.navService.keyService.valueUpdate$?.subscribe((newValue) => { 
            if (this.navService.keyService.inputId == 3) {
                this.password2 = newValue;
                this.password2 = this.password2 == '' ? '_' : this.password2;
            }
        });
    }
}
