import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as _ from 'lodash';
import { combineLatest, Subject } from 'rxjs';
import { skip, take, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.interface';
import { Day } from 'src/app/calendar/components/calendar/calendar.component';
import { CalendarService } from 'src/app/calendar/services/calendar.service';
import { AppMode } from 'src/app/recipies/containers/edit-recipy/edit-recipy.component';
import { Recipy } from 'src/app/recipies/models/recipy.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { DialogsService } from 'src/app/shared/services/dialogs.service';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { IAppState } from 'src/app/store/reducers';
import { getSelectedDay, getSelectedRecipy } from 'src/app/store/selectors/calendar.selectors';
import { getFilters } from 'src/app/store/selectors/filters.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import * as CalendarActions from './../../../store/actions/calendar.actions';
import * as FiltersActions from './../../../store/actions/filters.actions';

@Component({
  selector: 'app-recipies-pannel',
  templateUrl: './recipies-pannel.component.html',
  styleUrls: ['./recipies-pannel.component.scss'],
})
export class RecipiesPannelComponent implements OnInit {
  allRecipies: Recipy[] | undefined;
  isMobile: boolean = false;

  destroy$ = new Subject();
  showRecipyPreview: boolean = false; //TODO check the route url, if there's recipy id, open the tab
  recipyForPreview: Recipy | undefined;
  AppMode = AppMode;
  appMode: AppMode = AppMode.Planner;

  @Input() currentUser: User | null | undefined;
  constructor(
    private recipies: RecipiesService,
    private layoutService: LayoutService,
    private store: Store<IAppState>,
    private calendarService: CalendarService,
    private dialogsService: DialogsService
  ) {
    let recipies$ = this.store.pipe(
      select(getAllRecipies),
      takeUntil(this.destroy$)
    );
    let filters$ = this.store.pipe(
      select(getFilters),
      takeUntil(this.destroy$)
    );
    combineLatest([recipies$, filters$]).subscribe((res: [any, any]) => {
      let [recipies, filters] = res;
      let _recipies = recipies.map((recipy: any) => recipy);
      _recipies = _recipies.filter(
        (recipy: { notApproved: any }) => !recipy.notApproved
      );

      if (!!filters.ingredientsToInclude.length) {
        _recipies = _recipies.filter((recipy: { ingrediends: any[] }) => {
          let recipyIngredientsIds = recipy.ingrediends.map(
            (ingr: { product: any }) => ingr.product
          );
          return filters.ingredientsToInclude.every((id: any) =>
            recipyIngredientsIds.includes(id)
          );
        });
      }
      if (!!filters.ingredientsToExclude.length) {
        _recipies = _recipies.filter((recipy: { ingrediends: any[] }) => {
          let recipyIngredientsIds = recipy.ingrediends.map(
            (ingr: { product: any }) => ingr.product
          );
          return !recipy.ingrediends.find((ingr: { product: any }) =>
            filters.ingredientsToExclude.includes(ingr.product)
          );
        });
      }
      if (!!filters.tags.length) {
        _recipies = _recipies.filter((recipy: { type: string | any[] }) => {
          return filters.tags.every((tag: string) => recipy.type.includes(tag));
        });
      }
      if (!!filters.maxPrepTime) {
        const maxTime = filters.maxPrepTime;
        _recipies = _recipies.filter((recipy: { steps: any[] }) => {
          let prepTime = 0;
          recipy.steps.forEach(
            (step: { timeActive: any; timePassive: any }) => {
              prepTime = prepTime + (step.timeActive + step.timePassive);
            }
          );
          return prepTime <= maxTime;
        });
      }
      this.allRecipies = _recipies;
      this.recipies.filteredRecipies = this.allRecipies?.length
        ? this.allRecipies?.length
        : 0;
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
    this.store
      .pipe(select(getSelectedDay), takeUntil(this.destroy$))
      .subscribe((selectedDay: { day: Day; meal: string } | null) => {
        if (selectedDay) {
          this.appMode = AppMode.SelectRecipy;
          this.store
            .pipe(select(getSelectedRecipy), skip(1), take(1))
            .subscribe((selectedRecipy) => {
              if (selectedRecipy) {
                this.dialogsService
                  .openPortionsDialog()
                  .pipe(take(1))
                  .subscribe(
                    (amount: {
                      portions: number;
                      amountPerPortion: number;
                    }) => {
                      if (!!this.currentUser) {
                        let userToSave: User = _.cloneDeep(this.currentUser);
                        this.calendarService.saveRecipyToCalendar(
                          userToSave,
                          selectedDay.day.details.day,
                          selectedRecipy.id,
                          selectedDay.meal,
                          amount.portions,
                          amount.amountPerPortion
                        );
                        this.store.dispatch(
                          new CalendarActions.ResetCalendarStateAction()
                        );
                      }
                    }
                  );
              }
            });
        } else {
          this.appMode = AppMode.Planner;
        }
      });
  }

  onAddToCalendar(event: Recipy) {
    if (!this.isMobile) {
      this.store.dispatch(new CalendarActions.SetRecipySelectedAction(event));
    }
  }
  onRecipyClicked(event: Recipy) {
    this.showRecipyPreview = true;
    this.recipyForPreview = event;
  }

  closeRecipyPreview() {
    this.showRecipyPreview = false;
  }
}
