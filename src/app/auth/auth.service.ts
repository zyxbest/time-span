import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Path, URL } from 'assets/path';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl;
  clientId = environment.clientId;

  private userSubject: BehaviorSubject<any>;
  userObservable: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<unknown>(
      JSON.parse(localStorage.getItem('user') || '{}')
    );
    this.userObservable = this.userSubject.asObservable();
  }

  public get user() {
    return this.userSubject.value;
  }

  // 普通login
  login(username: string, password: string) {
    return this.http
      .post('login', {
        username,
        password,
      })
      .pipe(
        map((user: any) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  // github oauth login
  oauthLogin(username: string, password: string) {
    return new Observable((ob) => {
      const user = {
        tokenName: 'Authorization',
        tokenValue: username + ' ' + password,
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
      // return 0;
      ob.next(user);
    });
    // return user;
    /*     return this.http
      .post(
        URL.GITHUB_ACCESSTOKEN,

        {
          client_id: this.clientId,
          // client_secret: this.clientSecret,
          code,
        },
        {
          responseType: 'json',
          headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
          },
        }
      )
      .pipe(
        map(({ access_token }: any) => {
          const user = {
            tokenName: 'Authorization',
            tokenValue: 'bearer' + access_token,
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      ); */
  }

  authorize() {
    window.location.href = `${URL.GITHUB_AUTHORIZE}?client_id=${this.clientId}`;
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.http.get('logout').subscribe();
    this.router.navigate([Path.LOGIN_ROUTE]);
  }
}
