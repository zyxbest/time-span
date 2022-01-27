import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';
import { first } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;

  submitForm(): void {
    if (this.validateForm.valid) {
      this.login(this.validateForm.value);
      console.log('value', this.validateForm.value);
    } else {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  login(user: any) {
    return this.authService
      .oauthLogin(user.username, user.password)
      .pipe(first())
      .subscribe({
        next: () => {
          const returnUrl =
            this.route.snapshot.queryParams['returnUrl'] || '/homepage';
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true],
    });
  }

  oauth() {
    this.authService.authorize();
  }
}
