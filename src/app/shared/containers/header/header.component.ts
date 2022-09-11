import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Role, User } from 'src/app/auth/models/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IAppState } from 'src/app/store/reducers';

import * as UiActions from '../../../store/actions/ui.actions';
import { LayoutService } from '../../services/layout.service';
import { getCurrentRoute } from './../../../store/selectors/ui.selectors';
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
  currentRoute$: Observable<string>;

  Role = Role;
  constructor(private router: Router, private layoutService: LayoutService, private authService: AuthService, private store: Store<IAppState>) {
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => this.isMobile = bool);
      this.isLoggedIn$ = this.authService.isLoggedIn;
      this.currentUser$ = this.store.pipe(select(getCurrentUser));
      
      this.currentRoute$ = this.store.pipe(select(getCurrentRoute))
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

  onOpenFilters(){
    this.store.dispatch(new UiActions.SetIsSidebarOpenAction(true))
  }
}
