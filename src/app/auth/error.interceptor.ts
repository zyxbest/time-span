import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      // map((event: HttpEvent<any>) => {
      //   console.log('event', event);
      //   return event;
      // }),
      catchError((err: HttpErrorResponse) => {
        console.log('object');
        // 401,403自动退出登录
        if (
          [401, 403].includes(err.status) &&
          this.authService.userObservable
        ) {
          this.authService.logout();
        }
        const error = err.error?.message || err.statusText;
        console.error(err, 'err');
        console.log('err');
        // this.toastr.error(error);
        return throwError(() => new Error(error));
      })
    );
  }
}
