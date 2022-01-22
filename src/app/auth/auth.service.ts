import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Path } from 'assets/path';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl;
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

  login(username: string, password: string) {
    return this.http
      .post(this.apiUrl + '/login', {
        username,
        password,
      })
      .pipe(
        map((user:any) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }
  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.http.get(this.apiUrl + '/logout').subscribe();
    this.router.navigate([Path.LOGIN_ROUTE]);
  }
}
