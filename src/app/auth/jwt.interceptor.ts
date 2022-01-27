import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const user = this.authService.user;
    const isLoggedIn = user && user.tokenValue;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    console.log(isLoggedIn, 'isloginin');
    console.log(isApiUrl, 'isApiurl');

    // 为相对路由设置根路由
    if (!request.url.startsWith('http')) {
      request = request.clone({
        url: (environment.apiUrl || '') + '/' + request.url,
      });
    }
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          [user.tokenName]: user.tokenValue,
        },
      });
    }
    return next.handle(request);
  }
}
