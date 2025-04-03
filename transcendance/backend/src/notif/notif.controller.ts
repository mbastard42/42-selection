import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NotifService } from './notif.service';
@Controller('notifications')
export class NotifController {
    constructor (private readonly notifService: NotifService) {}

    @Get()
    getNotif( @Query('id') id: number): Array<String> {
        const notifs = this.notifService.getUserNotifications(id);
        if (notifs) {
            return notifs;
        }
        return [];
    }
}
