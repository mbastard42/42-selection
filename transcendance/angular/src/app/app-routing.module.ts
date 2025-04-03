import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavComponent } from './content/nav/nav.component';
import { MenuComponent } from './content/menu/menu.component';
import { SettingsComponent } from './content/settings/settings.component';
import { UserSearchComponent } from './content/friend/user-search/user-search.component';

const routes: Routes = [
    
    { path: '', component: MenuComponent },
    { path: 'nav', component: NavComponent},
    { path: 'game', loadChildren: () => import('./content/game/game.module').then(m => m.GameModule) },
    { path: 'login', loadChildren: () => import('./content/login/login.module').then(m => m.LoginModule) },
    { path: 'user-search', component: UserSearchComponent},
    { path: 'settings', component: SettingsComponent},
    { path: 'profile', loadChildren: () => import('./content/profile/profile.module').then(m => m.ProfileModule) },
    { path: 'friend', loadChildren: () => import('./content/friend/friend.module').then(m => m.FriendModule)} ,
    { path: 'chat', loadChildren: () => import('./content/chat/chat.module').then(m => m.ChatModule) },
];

@NgModule({

    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]

}) export class AppRoutingModule { }
