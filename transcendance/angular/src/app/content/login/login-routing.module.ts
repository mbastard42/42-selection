import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { Login42Component } from './login42/login42.component';
import { RegisterComponent } from './register/register.component';
import { CompleteInfoComponent } from './completeInfo/completeInfo.component';

const routes: Routes = [

    { path: '', component: LoginComponent },
    { path: 'login42', component: Login42Component },
    { path: 'register', component: RegisterComponent },
    { path: 'info', component: CompleteInfoComponent },
];

@NgModule({

    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

}) export class LoginRoutingModule {}