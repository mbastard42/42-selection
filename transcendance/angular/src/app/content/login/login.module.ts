import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Login42Component } from './login42/login42.component';
import { RegisterComponent } from './register/register.component';
import { LoginRoutingModule } from './login-routing.module';
import { CompleteInfoComponent } from './completeInfo/completeInfo.component';

@NgModule({

    declarations: [
        Login42Component,
        RegisterComponent,
        CompleteInfoComponent,
    ],
    imports: [
        CommonModule,
        LoginRoutingModule
    ]

}) export class LoginModule {}
