import { NgModule } from "@angular/core";
import { ProfileComponent } from "./profile/profile.component";
import { CommonModule } from "@angular/common";
import { ProfileRootingModule } from "./profile-routing.module";
import { QrCodeModule } from "ng-qrcode";
import { ScoreComponent } from "./score/score.component";
import { OtherProfileComponent } from "./other-profile/other-profile.component";

@NgModule({
    declarations: [
      ProfileComponent,
      ScoreComponent,
      OtherProfileComponent
    ],
    imports: [
      CommonModule,
      ProfileRootingModule,
      QrCodeModule,

    ]
  })
  export class ProfileModule { }
  