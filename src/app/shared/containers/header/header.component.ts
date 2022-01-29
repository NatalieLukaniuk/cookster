import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  isMobile: boolean = false;
  destroy$ = new Subject();
  constructor(private router: Router, private layoutService: LayoutService) {
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => this.isMobile = bool);
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
}
