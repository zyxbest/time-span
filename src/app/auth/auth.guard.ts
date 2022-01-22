import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Path } from 'assets/path';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user = this.authService.user;
    const isLoggedIn = user?.tokenValue;

    // 验证成功
    if (isLoggedIn) {
      return true;
    }

    // 未登录
    this.router.navigate([Path.LOGIN_ROUTE], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
