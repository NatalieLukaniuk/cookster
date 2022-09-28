import { Product } from 'src/app/recipies/models/products.interface';
import { RecipyForCalendar } from './../../../recipies/models/recipy.interface';
import { MealTime } from 'src/app/calendar/components/celandar-meal/celandar-meal.component';
import { map, takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject, combineLatest } from 'rxjs';
import { getCurrentRoute } from './../../../store/selectors/ui.selectors';
import { select, Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IAppState } from 'src/app/store/reducers';
import { getCalendar } from 'src/app/store/selectors/calendar.selectors';
import { Day } from 'src/app/calendar/components/calendar/calendar.component';
import { Recipy } from 'src/app/recipies/models/recipy.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { User } from 'src/app/auth/models/user.interface';

@Component({
  selector: 'app-scenario-by-mealtime',
  templateUrl: './scenario-by-mealtime.component.html',
  styleUrls: ['./scenario-by-mealtime.component.scss'],
})
export class ScenarioByMealtimeComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  mealtime: MealTime | undefined;
  date: string | undefined;
  calendar$: Observable<Day[] | null>;
  currentRoute$: Observable<string>;
  currentUser: User | undefined;
  currentUser$ = this.store.pipe(
    select(getCurrentUser),
    tap((user) => {
      if (user) {
        this.currentUser = user;
      }
    })
  );

  recipies: RecipyForCalendar[] | undefined;
  allProducts: Product[] | undefined;
  constructor(
    private store: Store<IAppState>,
    private recipiesService: RecipiesService
  ) {
    this.calendar$ = this.store.pipe(select(getCalendar));
    this.currentRoute$ = this.store.pipe(select(getCurrentRoute));
    this.recipiesService.products$.subscribe((res) => {
      if (res) {
        this.allProducts = res;
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {
    combineLatest([this.currentRoute$, this.calendar$])
      .pipe(
        takeUntil(this.destroy$),
        map((res) => ({ route: res[0], calendar: res[1] }))
      )
      .subscribe((res) => {
        if (res.route && res.calendar) {
          this.mealtime = res.route.split('_')[1] as MealTime;
          this.date = res.route.split('_')[0];
          let foundDay = res.calendar.find(
            (day) => day.details.day == this.date
          );
          if (foundDay) {
            switch (this.mealtime) {
              case MealTime.Breakfast:
                this.recipies = foundDay.details.breakfastRecipies;
                break;
              case MealTime.Lunch:
                this.recipies = foundDay.details.lunchRecipies;
                break;
              case MealTime.Dinner:
                this.recipies = foundDay.details.dinnerRecipies;
            }
          }
        }
      });
  }
}
