import { Injectable } from "@angular/core";
import { AuthRequest } from "./auth";
import { ChatRequest } from "./chat";
import { FriendRequest } from "./friend";
import { PongRequest } from "./pong";
import { UserRequest } from "./user";

@Injectable()
export class RequestIncludes
{
    constructor(
        public readonly authRequest: AuthRequest, 
        public readonly userRequest: UserRequest,
        public readonly friendRequest: FriendRequest,
        public readonly pongRequest: PongRequest,
        public readonly chatRequest: ChatRequest,
        ){}
}