import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: UntypedFormGroup;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.registrationForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', Validators.required),
    });
  }
  submit(){
    this.authService.registerUser(this.registrationForm.controls.email.value, this.registrationForm.controls.password.value)
  }
}
