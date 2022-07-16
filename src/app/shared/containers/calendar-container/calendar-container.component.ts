import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { Day } from '../../components/calendar/calendar/calendar.component';

@Component({
  selector: 'app-calendar-container',
  templateUrl: './calendar-container.component.html',
  styleUrls: ['./calendar-container.component.scss']
})
export class CalendarContainerComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;
  @Input() isSidePane = false;
  @Input() isRecipySelected: boolean = false;
  @Output() daySelected = new EventEmitter<{day: Day, meal: string}>();
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

  onDaySelected(event: {day: Day, meal: string}){
    this.daySelected.emit(event)
  }
}
