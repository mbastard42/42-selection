import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PongMenuComponent } from './pong-classique/pong-menu.component';
import { PongGameComponent } from './pong-classique/game/game.component';
import { SpecialPongMenuComponent } from './pong-special/pong-menu.component';
import { SpecialPongGameComponent } from './pong-special/game/game.component';
import { WatchGameComponent } from './watch-game/watch-game.component';

const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'pong', component: PongMenuComponent},
    { path: 'pong/play', component: PongGameComponent},
    { path: 'pong-special', component: SpecialPongMenuComponent},
    { path: 'pong-special/play', component: SpecialPongGameComponent},
    { path: 'watch/:gameId', component: WatchGameComponent}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
