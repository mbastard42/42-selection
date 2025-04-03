import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../class/user';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService, private authService : AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const current = this.userService.getUser()

    if(this.authService.isLogIn())
      request = this.setUserHeader(request, current);
    return next.handle(request);
  }


  setUserHeader(request: HttpRequest<any>, current: User) {
    return request.clone({
      setHeaders: {
        token : this.authService.token,
        userid: current.id.toString(),
      }
    });
  }
}