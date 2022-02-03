import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: any;
  allUsers: any;
  userAtFirebaseAuth: any;

  constructor(private authApiService: AuthApiService) {}

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
      .subscribe((res) => console.log(res));
  }

  getCurrentUser(userAtFirebaseAuth: any) {
    for (let user of this.allUsers) {
      if (userAtFirebaseAuth.email === user.email) {
        this.currentUser = user;
      }
    }
    console.log(this.currentUser);
  }

  updateUserDetailsFromMyDatabase(newData: any) {
    return this.authApiService.updateUser(this.currentUser.id, newData);
  }
}
