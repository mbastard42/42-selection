import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { HomeComponent } from './home/home.component';
import { PongMenuComponent } from './pong-classique/pong-menu.component';
import { PongGameComponent } from './pong-classique/game/game.component';
import { SpecialPongMenuComponent } from './pong-special/pong-menu.component';
import { SpecialPongGameComponent } from './pong-special/game/game.component';
import { WatchGameComponent } from './watch-game/watch-game.component';

@NgModule({
  declarations: [
    HomeComponent,
    PongMenuComponent,
    PongGameComponent,
    WatchGameComponent,
    SpecialPongMenuComponent,
    SpecialPongGameComponent,
  ],
  imports: [
    CommonModule,
    GameRoutingModule
  ]
})
export class GameModule { }
