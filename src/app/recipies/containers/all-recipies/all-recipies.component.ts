import { DialogsService } from './../../../shared/services/dialogs.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { combineLatest, Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.interface';
import { Day } from 'src/app/shared/components/calendar/calendar/calendar.component';
import { CalendarService } from 'src/app/shared/services/calendar.service';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { IAppState } from 'src/app/store/reducers';
import { getFilters } from 'src/app/store/selectors/filters.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

import { Recipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';
import * as FiltersActions from './../../../store/actions/filters.actions';

@Component({
  selector: 'app-all-recipies',
  templateUrl: './all-recipies.component.html',
  styleUrls: ['./all-recipies.component.scss'],
})
export class AllRecipiesComponent implements OnInit, OnDestroy {
  allRecipies: Recipy[] | undefined;
  isMobile: boolean = false;
  currentUser: User | undefined;
  destroy$ = new Subject();

  isShowSidePane: boolean = false;
  isRecipySelected: boolean = false;

  showBasicRecipies: boolean = false;
  showBasicRecipies$ = new BehaviorSubject<boolean>(false);

  daySelected$ = new Subject<{ day: Day; meal: string }>();
  constructor(
    private recipies: RecipiesService,
    private layoutService: LayoutService,
    private store: Store<IAppState>,
    private calendarService: CalendarService,
    private dialogsService: DialogsService
  ) {
    this.store.pipe(select(getCurrentUser)).subscribe((res: any) => {
      if (!!res) {
        this.currentUser = res;
      }
    });
    let recipies$ = this.store.pipe(
      select(getAllRecipies),
      takeUntil(this.destroy$)
    );
    let filters$ = this.store.pipe(
      select(getFilters),
      takeUntil(this.destroy$)
    );
    combineLatest([recipies$, filters$, this.showBasicRecipies$]).subscribe((res) => {
      let [recipies, filters, showBasicRecipies] = res;
      let _recipies = recipies.map((recipy) => recipy);
      if (!showBasicRecipies) {
        _recipies = _recipies.filter((recipy) => !recipy.isBaseRecipy);
      }

      if (!!filters.ingredientsToInclude.length) {
        _recipies = _recipies.filter((recipy) => {
          let recipyIngredientsIds = recipy.ingrediends.map(
            (ingr) => ingr.product
          );
          return filters.ingredientsToInclude.every((id) =>
            recipyIngredientsIds.includes(id)
          );
        });
      }
      if (!!filters.ingredientsToExclude.length) {
        _recipies = _recipies.filter((recipy) => {
          let recipyIngredientsIds = recipy.ingrediends.map(
            (ingr) => ingr.product
          );
          return !recipy.ingrediends.find((ingr) =>
            filters.ingredientsToExclude.includes(ingr.product)
          );
        });
      }
      if (!!filters.tags.length) {
        _recipies = _recipies.filter((recipy) => {
          return filters.tags.every((tag) => recipy.type.includes(tag));
        });
      }
      if (!!filters.maxPrepTime) {
        const maxTime = filters.maxPrepTime;
        _recipies = _recipies.filter((recipy) => {
          let prepTime = 0;
          recipy.steps.forEach((step) => {
            prepTime = prepTime + (step.timeActive + step.timePassive);
          });
          return prepTime <= maxTime;
        });
      }
      this.allRecipies = _recipies;
      this.recipies.filteredRecipies = this.allRecipies.length;
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.store.dispatch(new FiltersActions.ResetFiltersAction());
  }

  ngOnInit() {
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => (this.isMobile = bool));
  }

  onAddToCalendar(event: Recipy) {
    if (!this.isMobile) {
      this.isRecipySelected = true;
      this.isShowSidePane = true;
      this.daySelected$
        .pipe(take(1))
        .subscribe((selectedDay: { day: Day; meal: string }) => {
          console.log(selectedDay);
          this.dialogsService
            .openPortionsDialog()
            .pipe(take(1))
            .subscribe(
              (amount: { portions: number; amountPerPortion: number }) => {
                if (!!this.currentUser) {
                  let userToSave: User = _.cloneDeep(this.currentUser);
                  this.calendarService.saveRecipyToCalendar(
                    userToSave,
                    selectedDay.day.details.day,
                    event.id,
                    selectedDay.meal,
                    amount.portions,
                    amount.amountPerPortion
                  );
                  this.isRecipySelected = false;
                }
              }
            );
        });
    }
  }

  onDaySelected(event: { day: Day; meal: string }) {
    this.daySelected$.next(event);
  }

  
  toggleShpwBasicRecipies(){
    this.showBasicRecipies = !this.showBasicRecipies;
    this.showBasicRecipies$.next(this.showBasicRecipies)
  }
}
