import { NgModule } from "@angular/core";
import { FriendlistComponent } from "./friendlist/friendlist.component";
import { CommonModule } from "@angular/common";
import { FriendRoutingModule } from "./friend-routing.module";
import { UserSearchComponent } from "./user-search/user-search.component";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [
      FriendlistComponent,
      UserSearchComponent
    ],
    imports: [
      CommonModule,
      FriendRoutingModule,
      FormsModule

    ]
  })
  export class FriendModule { }
  