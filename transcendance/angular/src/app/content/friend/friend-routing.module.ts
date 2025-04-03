import { RouterModule, Routes } from "@angular/router";
import { FriendlistComponent } from "./friendlist/friendlist.component";
import { NgModule } from "@angular/core";
import { UserSearchComponent } from "./user-search/user-search.component";

const routes: Routes = [
    { path: '', component: FriendlistComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule]
})
export class FriendRoutingModule { }
