import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NavService } from 'src/app/services/nav/nav.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationsService } from 'src/app/services/notifService/notifications.service';

@Component({

    selector: 'app-login42',
    templateUrl: './login42.component.html',
    styleUrls: ['./login42.component.css']

}) export class Login42Component implements OnInit {
  
    constructor( private readonly route: ActivatedRoute, private readonly authService: AuthService, private readonly navService: NavService, private readonly notifService: NotificationsService, private readonly router: Router ) {}

    ngOnInit(): void {

        if (this.authService.isLogIn())
            this.navService.navigateToId('menu_game/')
        this.route.queryParams.subscribe(params => { const code = params['code']; (code && code.length > 0) ? this.loginRequest(code) : this.exitError('Invalid 42 code, please try again later'); });
    }

    loginRequest(code : string) {

        this.authService.loginWith42(code).then((status) => {

            if (status == 200)
                this.router.navigate(['/'])
            else if (status == 202)
                this.router.navigate(['/login/info'])
            else if (status == 400)
                this.exitError('Login with 42 failed, please try again later')
            else if (status == 401)
                this.exitError('Login with 42 failed: Invalid 2FA code')
        });
    }

    exitError(message : string) {

        this.router.navigate(['/'])
        this.notifService.addNotification(message)
    }
}
