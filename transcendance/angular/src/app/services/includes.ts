import { Injectable } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { ChatListService } from "./chatList/chat-list.service";
import { NotificationsService } from "./notifService/notifications.service";
import { RootingService } from "./rooting/rooting.service";
import { UserService } from "./user/user.service";
import { ChatService } from "./chat/chat.service";

@Injectable()
export class ServiceIncludes
{
    constructor(
        public readonly authService : AuthService,
        public readonly chatListService : ChatListService,
        public readonly notifService : NotificationsService,
        public readonly userService : UserService,
        public readonly rootingService : RootingService,
        public readonly chatSerivce : ChatService
    ){}
}