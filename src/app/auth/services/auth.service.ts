import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.interface';

import { UserService } from './user.service';
import * as UserActions from '../../store/actions/user.actions'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private userService: UserService, private store: Store) { }

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
        if (user.email) {
          let currentUser: User = {
            email: user.email,
            uid: user.uid
          }
          this.store.dispatch(new UserActions.UserLoadedAction(currentUser))
        }

        this.userService.userAtFirebaseAuth = user;
        console.log(user)
        this.isLoggedIn.next(true);
      } else {
        this.isLoggedIn.next(false);
      }
    });
  }




}
