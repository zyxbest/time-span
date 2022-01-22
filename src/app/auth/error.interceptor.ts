import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        // 401,403自动退出登录
        if ([401, 403].includes(err.status) && this.authService.userObservable) {
          this.authService.logout();
        }
        const error = err.error?.message || err.statusText;
        console.error(err);
        return throwError(() => new Error(error));
      })
    );
  }
}
