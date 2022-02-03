import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private userService: UserService) {}

  registerUser(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        this.userService.userAtFirebaseAuth = userCredential.user;
        this.isLoggedIn.next(true);
        this.userService.addUser(auth);
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
        this.userService.userAtFirebaseAuth = userCredential.user;
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
        this.userService.userAtFirebaseAuth = user;
        this.isLoggedIn.next(true);
      } else {
        this.isLoggedIn.next(false);
      }
    });
  }




}
