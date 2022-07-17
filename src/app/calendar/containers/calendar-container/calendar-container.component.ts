import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  isSidePane = false;
  @Input() isRecipySelected: boolean = false;
  destroy$ = new Subject();
  constructor(private layoutService: LayoutService, private route: ActivatedRoute) {
    
   }

  ngOnInit() {
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => (this.isMobile = bool));
      this.route
      .data
      .subscribe(result => this.isSidePane = result.isSidePane);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
