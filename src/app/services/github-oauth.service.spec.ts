import { TestBed } from '@angular/core/testing';

import { GithubOauthService } from './github-oauth.service';

describe('GithubOauthService', () => {
  let service: GithubOauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GithubOauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
