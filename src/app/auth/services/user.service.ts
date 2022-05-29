import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import * as UserActions from '../../store/actions/user.actions'

import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: any;
  allUsers: any;
  userAtFirebaseAuth: any;

  constructor(private authApiService: AuthApiService, private store: Store) {}

  getAllUsers() {
    this.authApiService
      .getUsers()
      .pipe(take(1))
      .subscribe((res) => {
        let array = Object.entries(res);
        let users: any = [];
        for (let entry of array) {
          let user: any = {
            id: entry[0],
            ...entry[1],
          };
          users.push(user);
        }
        this.allUsers = users;
        this.getCurrentUser(this.userAtFirebaseAuth);
      });
  }

  addUser(auth: any) {
    let user = {
      email: auth.currentUser?.email,
      recipies: [],
      uid: auth.currentUser?.uid,
    };
    this.authApiService
      .addUser(user)
      .pipe(take(1))
      .subscribe((res) => {
        this.getAllUsers()
      });
  }

  getCurrentUser(userAtFirebaseAuth: any) {
    for (let user of this.allUsers) {
      if (userAtFirebaseAuth.email === user.email) {
        console.log(user)
        this.currentUser = user;
        this.store.dispatch(new UserActions.UserLoadedAction(user))
      }
    }
  }

  updateUserDetailsFromMyDatabase(newData: any) {
    return this.authApiService.updateUser(this.currentUser.id, newData);
  }
}
