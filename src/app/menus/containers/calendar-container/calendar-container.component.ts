import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutService } from 'src/app/shared/services/layout.service';

@Component({
  selector: 'app-calendar-container',
  templateUrl: './calendar-container.component.html',
  styleUrls: ['./calendar-container.component.scss']
})
export class CalendarContainerComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;
  destroy$ = new Subject();
  constructor(private layoutService: LayoutService) { }

  ngOnInit() {
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => (this.isMobile = bool));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
