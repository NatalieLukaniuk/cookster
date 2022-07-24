import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { combineLatest, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.interface';
import { Day } from 'src/app/calendar/components/calendar/calendar.component';
import { CalendarService } from 'src/app/calendar/services/calendar.service';
import { Recipy } from 'src/app/recipies/models/recipy.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { DialogsService } from 'src/app/shared/services/dialogs.service';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { IAppState } from 'src/app/store/reducers';
import { getFilters } from 'src/app/store/selectors/filters.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

import * as CalendarActions from './../../../store/actions/calendar.actions';
import * as FiltersActions from './../../../store/actions/filters.actions';
import { getSelectedDay, getSelectedRecipy } from './../../../store/selectors/calendar.selectors';

export enum PlannerRecipyCategories {
  Soups = 'перші страви',
  Main = 'другі страви',
  Salads = 'салати',
  Meat = "м'ясо",
  FishAndSeafood = 'риба та морепродукти',
  Garnish = 'гарнір',
  Appetizers = 'закуски',
  Vegs = 'овочі',
  Fruit = 'фрукти',
  Drinks = 'напої',
  Other = 'інше',
}

@Component({
  selector: 'app-planner-recipies',
  templateUrl: './recipies.component.html',
  styleUrls: ['./recipies.component.scss'],
})
export class RecipiesComponent implements OnInit, OnDestroy {
  allRecipies: Recipy[] | undefined;
  isMobile: boolean = false;
  currentUser: User | undefined;
  destroy$ = new Subject();

  categories = Object.values(PlannerRecipyCategories).filter(
    (value) => typeof value === 'string'
  );

  selectedCategory = this.categories[0];

  constructor(
    private recipies: RecipiesService,
    private layoutService: LayoutService,
    private store: Store<IAppState>,
    private calendarService: CalendarService,
    private dialogsService: DialogsService,
    private router: Router,
    private route: ActivatedRoute
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
    combineLatest([recipies$, filters$]).subscribe((res) => {
      let [recipies, filters] = res;
      let _recipies = recipies.map((recipy) => recipy);
      _recipies = _recipies.filter((recipy) => !recipy.notApproved);

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
    this.store
      .pipe(select(getSelectedDay), takeUntil(this.destroy$))
      .subscribe((selectedDay: { day: Day; meal: string } | null) => {
        if (selectedDay) {
          this.dialogsService
            .openPortionsDialog()
            .pipe(take(1))
            .subscribe(
              (amount: { portions: number; amountPerPortion: number }) => {
                if (!!this.currentUser) {
                  let userToSave: User = _.cloneDeep(this.currentUser);
                  this.store
                    .pipe(select(getSelectedRecipy), take(1))
                    .subscribe((selectedRecipy) => {
                      if (selectedRecipy) {
                        this.calendarService.saveRecipyToCalendar(
                          userToSave,
                          selectedDay.day.details.day,
                          selectedRecipy.id,
                          selectedDay.meal,
                          amount.portions,
                          amount.amountPerPortion
                        );
                      }
                      this.store.dispatch(
                        new CalendarActions.ResetCalendarStateAction()
                      );
                    });
                }
              }
            );
        }
      });
    console.log(this.categories);
  }

  onAddToCalendar(event: Recipy) {
    if (!this.isMobile) {
      this.store.dispatch(new CalendarActions.SetRecipySelectedAction(event));
    }
  }

  getRecipiesToDispay(category: PlannerRecipyCategories): Recipy[] {
    if (this.allRecipies) {
      switch (category) {
        case PlannerRecipyCategories.Soups:
          return this.allRecipies?.filter((recipy) => recipy.type.includes(3));
        case PlannerRecipyCategories.Main:
          return this.allRecipies.filter((recipy) => recipy.type.includes(4));
        case PlannerRecipyCategories.Salads:
          return this.allRecipies.filter((recipy) => recipy.type.includes(7));
        case PlannerRecipyCategories.Appetizers:
          return this.allRecipies.filter(
            (recipy) =>
              recipy.type.includes(5) ||
              recipy.type.includes(6) ||
              recipy.type.includes(8)
          );
        case PlannerRecipyCategories.Meat:
          return this.allRecipies.filter((recipy) => recipy.type.includes(15));
        case PlannerRecipyCategories.Garnish:
          return this.allRecipies.filter((recipy) => recipy.type.includes(23));
        case PlannerRecipyCategories.FishAndSeafood:
          return this.allRecipies.filter((recipy) => recipy.type.includes(24));
      }
    }
    return [];
  }

  getIsTabWithRecipies(category: PlannerRecipyCategories): boolean {
    const categoriesWithRecipies = [
      PlannerRecipyCategories.Main,
      PlannerRecipyCategories.Salads,
      PlannerRecipyCategories.Soups,
      PlannerRecipyCategories.Appetizers,
      PlannerRecipyCategories.FishAndSeafood,
      PlannerRecipyCategories.Garnish,
      PlannerRecipyCategories.Meat,
    ];
    return categoriesWithRecipies.includes(category);
  }

  onRecipyClicked(event: Recipy) {
    console.log(event);
  }
}
