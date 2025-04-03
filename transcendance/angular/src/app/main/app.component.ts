import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NavService } from '../services/nav/nav.service';
import { SocketService } from '../services/socket/socket.service';
import { ServiceIncludes } from '../services/includes';

@Component({

    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']

}) export class AppComponent {

    title = 'angular';
    
    constructor(private navService: NavService, private service: ServiceIncludes, private router: Router, private socketService: SocketService) {

        this.navService.keyService.setKey({id: 'up', key: 'z', delay: 1});
        this.navService.keyService.setKey({id: 'down', key: 's', delay: 1});
        this.navService.keyService.setKey({id: 'left', key: 'q', delay: 1});
        this.navService.keyService.setKey({id: 'right', key: 'd', delay: 1});
        this.navService.keyService.setKey({id: 'next', key: 'i', delay: -1});
        this.navService.keyService.setKey({id: 'prev', key: 'j', delay: -1});
        this.navService.keyService.setKey({id: 'select', key: 'v', delay: -1, behaviorId: 'toggleSelect', behavior: this.toggleSelect});
        this.navService.keyService.setKey({id: 'start', key: 'b', delay: -1});
    }

    toggleSelect = (): void => {

        const actual = this.navService.head?.route;
        const route = this.navService.cutOnRoute(actual!)[1];
        if (!route || route.length == 0 || route == "/settings" || route == '/nav' ||  route.includes('/login') || route == '/' || route.includes('/pong/game') || route.includes('/pong-special/game'))
            return ;
        this.navService.setElem({id: 'select/', next: 'quick_profile/nav', prev: actual});
        this.navService.setElem({id: 'quick_profile/nav', prev: actual});
        this.navService.head = this.navService.getElem('select/');
        this.navService.next();
    }

    getKey(id: string): string | undefined {

        if (this.navService.keyService.getValues({id: id})?.key !== undefined)
            return this.navService.keyService.getValues({id: id})?.key?.toUpperCase()
        else
            return undefined;
    }

    whenKey(id: string): boolean { return this.navService.keyService.isKeyPressed(this.navService.keyService.getValues({id: id})?.key ?? ''); }

    press(id: string): void { this.navService.keyService.press({id: id}, true); }

    depress(id: string) : void {
        this.navService.keyService.pressedKeys.delete(this.navService.keyService.getValues({id: id})?.key ?? '');
     }
}