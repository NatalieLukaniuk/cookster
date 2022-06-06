import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = new UntypedFormGroup({
      username: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', Validators.required),
    });
  }

  submit() {
    this.authService.loginUser(
      this.loginForm.controls.username.value,
      this.loginForm.controls.password.value
    );
  }

  goRegistration() {
    this.router.navigate(['register']);
  }
}
