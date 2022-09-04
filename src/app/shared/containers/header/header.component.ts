import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Role, User } from 'src/app/auth/models/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

import { LayoutService } from '../../services/layout.service';
import { getCurrentUser } from './../../../store/selectors/user.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  isMobile: boolean = false;
  destroy$ = new Subject();
  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<User | null>;

  Role = Role;
  constructor(private router: Router, private layoutService: LayoutService, private authService: AuthService, private store: Store) {
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => this.isMobile = bool);
      this.isLoggedIn$ = this.authService.isLoggedIn;
      this.currentUser$ = this.store.pipe(select(getCurrentUser));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  goHome() {
    this.router.navigate(['']);
  }

  goAdmin() {
    this.router.navigate(['admin-panel']);
  }

  logout(){
    this.authService.logoutUser()
  }
}
