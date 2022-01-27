import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { URL } from 'assets/path';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GithubOauthService {
  constructor(private http: HttpClient, private router: Router) {}
  clientId = environment.clientId;
  // clientSecret = environment.clientSecret;

  authorize() {
    window.location.href = `${URL.GITHUB_AUTHORIZE}?client_id=${this.clientId}`;
  }
}
