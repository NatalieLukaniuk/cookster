import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { UserReducers } from '../store/reducers/user.reducer';

import { SharedModule } from './../shared/shared.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    StoreModule.forFeature('user', UserReducers)
  ],
  declarations: [AuthComponent, LoginComponent, RegistrationComponent],
  exports: [LoginComponent]
})
export class AuthModule { }
