import { RouterModule, Routes } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";
import { NgModule } from "@angular/core";
import { OtherProfileComponent } from "./other-profile/other-profile.component";

const routes: Routes = [
    { path: '', component: ProfileComponent},
    { path: 'other/:username', component: OtherProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRootingModule { }
