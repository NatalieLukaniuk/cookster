import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userAtFirebase: any;
  isLoggedIn = new BehaviorSubject<boolean>(false);
  allUsers: any = [];
  userDetailsFromMyDatabase: any;
  constructor(private authApiService: AuthApiService) {}

  registerUser(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        this.userAtFirebase = userCredential.user;
        this.isLoggedIn.next(true);
        this.addUserToFirebase();
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  loginUser(email: string, password: string) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.userAtFirebase = userCredential.user;
        this.isLoggedIn.next(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  logoutUser() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.isLoggedIn.next(false);
      })
      .catch((error) => {
        // An error happened.
      });
  }

  checkIsLoggedIn() {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        this.userAtFirebase = user;
        this.isLoggedIn.next(true);
      } else {
        this.isLoggedIn.next(false);
      }
    });
  }

  addUserToFirebase() {
    const auth = getAuth();
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
        this.getCurrentUser()
      });
  }

  getCurrentUser() {
    for (let user of this.allUsers){
      if(this.userAtFirebase.email === user.email){
        this.userDetailsFromMyDatabase = user;
      }
    }
  }

  updateUserDetailsFromMyDatabase(newData: any){
    return this.authApiService.updateUser(this.userDetailsFromMyDatabase.id, newData)
  }
}
