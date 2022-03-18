import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { nickname } from 'assets/nickname';
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
  oauthLogin(username: string, password: string, repo: string) {
    return new Observable((ob) => {
      const strs = repo.split('/');
      const user = {
        tokenName: 'Authorization',
        tokenValue: password,
        owner: strs[0],
        repo: strs[1],
        username,
        nickname: nickname[username],
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
      ob.next(user);
    });
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
