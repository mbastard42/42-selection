import { ServiceIncludes } from './services/includes';

//  ANGULAR IMPORTS

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

//  MODULES IMPORTS

import { AppRoutingModule } from './app-routing.module';

//  SERVICES IMPORTS

import { PongService } from './services/pong/pong.service';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth/auth.service';
import { SocketService } from './services/socket/socket.service';
import { RootingService } from './services/rooting/rooting.service';
import { ChatListService } from './services/chatList/chat-list.service';
import { NotificationsService } from './services/notifService/notifications.service';

//  NETWORK IMPORTS

import { AuthRequest } from './network/auth';
import { ChatRequest } from './network/chat';
import { UserRequest } from './network/user';
import { PongRequest } from './network/pong';
import { FriendRequest } from './network/friend';
import { RequestIncludes } from './network/includes';
import { AuthInterceptor } from './network/interceptor';

//  COMPONENTS IMPORTS

import { AppComponent } from './main/app.component';
import { NavComponent } from './content/nav/nav.component';
import { MenuComponent } from './content/menu/menu.component';
import { LoginComponent } from './content/login/login/login.component';
import { AlertComponent } from './content/notif/notif.component';
import { SettingsComponent } from './content/settings/settings.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({

    declarations: [
        AppComponent,
        MenuComponent,
        LoginComponent,
        NavComponent,
        AlertComponent,
        SettingsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        SocketIoModule.forRoot(config),
    ],
    providers: [
        AuthService,
        ChatListService,
        NotificationsService,
        RootingService,
        UserService,
        PongService,
        ServiceIncludes,
        SocketService,
        AuthRequest,
        ChatRequest,
        FriendRequest,
        UserRequest,
        PongRequest,
        RequestIncludes,
        {
            provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]

}) export class AppModule {}
