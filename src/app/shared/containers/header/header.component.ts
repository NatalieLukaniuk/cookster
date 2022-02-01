import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';

import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  isMobile: boolean = false;
  destroy$ = new Subject();
  isLoggedIn$: Observable<boolean>;
  constructor(private router: Router, private layoutService: LayoutService, private authService: AuthService) {
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => this.isMobile = bool);
      this.isLoggedIn$ = this.authService.isLoggedIn;

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
