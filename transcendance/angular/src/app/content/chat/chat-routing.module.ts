import { RouterModule, Routes } from "@angular/router";
import { ChatlistComponent } from "./chatlist/chatlist.component";
import { NgModule } from "@angular/core";
import { ChatComponent } from "./chat/chat.component";

const routes: Routes = [
    { path: '', component: ChatlistComponent},
    {path: 'chat/:channelId', component: ChatComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
