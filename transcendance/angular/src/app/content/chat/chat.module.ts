import { NgModule } from "@angular/core";
import { ChatlistComponent } from "./chatlist/chatlist.component";
import { CommonModule } from "@angular/common";
import { ChatRoutingModule } from "./chat-routing.module";
import { FormsModule } from "@angular/forms";
import { ChatComponent } from "./chat/chat.component";
import { AlertComponent } from "../notif/notif.component";

@NgModule({
    declarations: [
      ChatlistComponent,
      ChatComponent,
    ],
    imports: [
      CommonModule,
      ChatRoutingModule,
      FormsModule,

    ]
  })
  export class ChatModule { }
  