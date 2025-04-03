import { Component } from '@angular/core';
import { NavService } from 'src/app/services/nav/nav.service';

@Component({

    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']

}) export class SettingsComponent {

    info: string;

    constructor(private readonly navService: NavService) {

        this.info = 'Select a button';
        this.navService.setElem({id: 'title/settings', down: 'up/settings', next: 'up/settings', prev: 'menu_settings/'});
        this.navService.setElem({id: 'up/settings', left: 'left/settings', down: 'left/settings', right: 'right/settings', up: 'title/settings', prev: 'menu_settings/', nextBehavior: this.setUp});
        this.navService.setElem({id: 'left/settings', up: 'up/settings', right: 'right/settings', down: 'down/settings', prev: 'menu_settings/', nextBehavior: this.setLeft});
        this.navService.setElem({id: 'right/settings', up: 'up/settings', left: 'left/settings', down: 'down/settings', right: 'prev/settings', prev: 'menu_settings/', nextBehavior: this.setRight});
        this.navService.setElem({id: 'down/settings', up: 'right/settings', down: 'select/settings', left: 'left/settings', right: 'select/settings', prev: 'menu_settings/', nextBehavior: this.setDown});
        this.navService.setElem({id: 'select/settings', up: 'down/settings', right: 'start/settings', left: 'down/settings', prev: 'menu_settings/', nextBehavior: this.setSelect});
        this.navService.setElem({id: 'start/settings', left: 'select/settings', up: 'prev/settings', right: 'prev/settings', prev: 'menu_settings/', nextBehavior: this.setStart});
        this.navService.setElem({id: 'prev/settings', left: 'right/settings', up: 'next/settings', right: 'next/settings', down: 'start/settings', prev: 'menu_settings/', nextBehavior: this.setPrev});
        this.navService.setElem({id: 'next/settings', left: 'prev/settings', up: 'title/settings', down: 'prev/settings', prev: 'menu_settings/', nextBehavior: this.setNext});
        this.navService.setDefaultElem('title', '/settings');
    }
    
    naviguate = (id: string) => { this.navService.keyService.isKeysMutted() ? null : this.navService.navigateToId(id); }
    press(id: string): void { this.navService.keyService.press({id: id}, true); }
    
    isSelected(id : string) : boolean { return this.navService.isSelected(id) }

    getKey(id: string): string | undefined {

        if (this.navService.keyService.getValues({id: id})?.key !== undefined)
            return this.navService.keyService.getValues({id: id})?.key?.toUpperCase();
        else
            return undefined;
    }

    private setUp = () => { this.setKey('up', 0); }
    private setDown = () => { this.setKey('down', 1); }
    private setLeft = () => { this.setKey('left', 2); }
    private setRight = () => { this.setKey('right', 3); }
    private setSelect = () => { this.setKey('select', 4); }
    private setStart = () => { this.setKey('start', 5); }
    private setPrev = () => { this.setKey('prev', 6); }
    private setNext = () => { this.setKey('next', 7); }

    private setKey(id: string, num: number): void {

        let done: boolean;
        let key: string | undefined = this.navService.keyService.getValues({id: id})?.key;

        done = false;
        this.info = 'Press a key';
        this.navService.keyService.setKey({id: id, block: true});
        this.navService.keyService.usingKeyboard('', null, num, () => {
            done = true;
            this.info = 'Select a button';
            setTimeout(() => { this.navService.keyService.setKey({id: id, block: false}); }, 1000);
        });
        this.navService.keyService.valueUpdate$?.subscribe((newValue) => {

            if (this.navService.keyService.inputId === num && !done) {

                if (newValue === key || this.navService.keyService.getIdByKey(newValue) === undefined) {
                    this.navService.keyService.setKey({id: id, key: newValue});
                    this.press('quit');
                }
                if (!done && this.navService.keyService.getIdByKey(newValue))
                    this.info = 'Key already used';
            }
        });
    }
}
