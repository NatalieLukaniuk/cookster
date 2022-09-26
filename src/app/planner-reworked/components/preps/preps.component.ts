import { map, takeUntil, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { Day } from 'src/app/calendar/components/calendar/calendar.component';
import { IAppState } from 'src/app/store/reducers';
import { getCalendar } from 'src/app/store/selectors/calendar.selectors';
import { getCurrentPlanner } from 'src/app/store/selectors/planners.selectors';
import { PlannerByDate } from '../../models';
import { Suggestion, SuggestionList } from '../../preps.models';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';
import { convertAmountToSelectedUnit } from 'src/app/recipies/services/recipies.utils';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { RecipyForCalendar } from 'src/app/recipies/models/recipy.interface';
import { Product } from 'src/app/recipies/models/products.interface';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { User } from 'src/app/auth/models/user.interface';

@Component({
  selector: 'app-preps',
  templateUrl: './preps.component.html',
  styleUrls: ['./preps.component.scss'],
})
export class PrepsComponent implements OnInit, OnDestroy {
  currentPlanner: PlannerByDate | undefined;
  destroyed$ = new Subject();
  allPrepsInDateRange: Suggestion[] = [];

  planner$: Observable<PlannerByDate | null>;
  calendar$: Observable<Day[] | null>;
  allProducts$: Observable<Product[]>;

  allProducts!: Product[] | null;
  currentUser: User | undefined;
  currentUser$ = this.store.pipe(
    select(getCurrentUser),
    tap((user) => {
      if (user) {
        this.currentUser = user;
      }
    })
  );

  constructor(
    private store: Store<IAppState>,
    private recipiesService: RecipiesService
  ) {
    this.planner$ = this.store.pipe(select(getCurrentPlanner));
    this.calendar$ = this.store.pipe(select(getCalendar));
    this.allProducts$ = this.recipiesService.products$.asObservable();
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit() {
    combineLatest([this.planner$, this.calendar$, this.allProducts$])
      .pipe(
        takeUntil(this.destroyed$),
        map((res) => ({ planner: res[0], calendar: res[1], products: res[2] }))
      )
      .subscribe((res) => {
        if (res.planner) {
          this.currentPlanner = res.planner;
        }
        if (res.products) {
          this.allProducts = res.products;
        }
        if (res.calendar && res.planner && res.products) {
          this.findPrep(res.calendar, {
            startDate: res.planner.startDate,
            endDate: res.planner.endDate,
          });
          console.log(this.allPrepsInDateRange);
        }
      });
  }

  findPrep(calendar: Day[], dateRange: { startDate: string; endDate: string }) {
    this.allPrepsInDateRange = [];
    calendar.forEach((day: Day) => {
      if (day.details.breakfastRecipies.length) {
        day.details.breakfastRecipies.forEach((recipy: RecipyForCalendar) => {
          recipy.ingrediends.forEach((ingr) => {
            if (ingr.prep) {
              ingr.prep.forEach((text) => {
                this.addSuggestion(
                  ingr,
                  this.recipiesService.getCoeficient(
                    recipy.ingrediends,
                    recipy.portions,
                    recipy.amountPerPortion
                  ),
                  text,
                  recipy.id,
                  recipy.name,
                  day.value.toDate()
                );
              });
            }
          });
        });
      }
      if (day.details.lunchRecipies.length) {
        day.details.lunchRecipies.forEach((recipy: RecipyForCalendar) => {
          recipy.ingrediends.forEach((ingr) => {
            if (ingr.prep) {
              ingr.prep.forEach((text) => {
                this.addSuggestion(
                  ingr,
                  this.recipiesService.getCoeficient(
                    recipy.ingrediends,
                    recipy.portions,
                    recipy.amountPerPortion
                  ),
                  text,
                  recipy.id,
                  recipy.name,
                  day.value.toDate()
                );
              });
            }
          });
        });
      }
      if (day.details.dinnerRecipies.length) {
        day.details.dinnerRecipies.forEach((recipy: RecipyForCalendar) => {
          recipy.ingrediends.forEach((ingr) => {
            if (ingr.prep) {
              ingr.prep.forEach((text) => {
                this.addSuggestion(
                  ingr,
                  this.recipiesService.getCoeficient(
                    recipy.ingrediends,
                    recipy.portions,
                    recipy.amountPerPortion
                  ),
                  text,
                  recipy.id,
                  recipy.name,
                  day.value.toDate()
                );
              });
            }
          });
        });
      }
    });
  }

  addSuggestion(
    ingredient: Ingredient,
    coef: number,
    prepDescription: string,
    recipyId: string,
    recipyName: string,
    day: Date
  ) {
    if (this.allProducts) {
      let suggestion: Suggestion = {
        productId: ingredient.product,
        productName: this.recipiesService.getIngredientText(ingredient),
        amount: convertAmountToSelectedUnit(
          ingredient.defaultUnit,
          { ...ingredient, amount: ingredient.amount * coef },
          this.allProducts
        ),
        unit: ingredient.defaultUnit,
        prepDescription: prepDescription,
        recipyId: recipyId,
        recipyTitle: recipyName,
        day: day,
      };
      this.allPrepsInDateRange.push(suggestion);
    }
  }

  isSaved(suggestion: Suggestion): boolean {
    if (this.currentUser && !!this.currentUser.prepLists) {
      return !!this.currentUser.prepLists.find((list: SuggestionList) =>
        list.suggestions?.find(
          (sugg) =>
            sugg.productId == suggestion.productId &&
            sugg.prepDescription == suggestion.prepDescription &&
            sugg.recipyId == suggestion.recipyId
        )
      );
    } else return false
  }
}
