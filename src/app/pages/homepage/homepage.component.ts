import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  isCollapsed = false;
  code = '';
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
/*     const code = this.route.snapshot.queryParams['code'];
    console.log(code);
    if (code) {
      this.authService.oauthLogin(code);
    } */
  }
}
