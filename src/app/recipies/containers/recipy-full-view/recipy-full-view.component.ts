import {
  SetIsLoadingAction,
  SetIsLoadingFalseAction,
} from './../../../store/actions/ui.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/auth/services/user.service';

import { Ingredient } from '../../models/ingredient.interface';
import { PreparationStep } from '../../models/preparationStep.interface';
import { Recipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';

export interface IngredientsByGroup {
  main: Ingredient[];
  filling: Ingredient[];
  souce: Ingredient[];
  dough: Ingredient[];
  decoration: Ingredient[];
}

export interface StepsByGroup extends Record<string, any> {
  main: PreparationStep[];
  filling: PreparationStep[];
  souce: PreparationStep[];
  dough: PreparationStep[];
  decoration: PreparationStep[];
}

export class ingredientsByGroup implements IngredientsByGroup {
  main: Ingredient[] = [];
  decoration: Ingredient[] = [];
  dough: Ingredient[] = [];
  souce: Ingredient[] = [];
  filling: Ingredient[] = [];
}

export class stepsByGroup implements StepsByGroup {
  main: PreparationStep[] = [];
  filling: PreparationStep[] = [];
  souce: PreparationStep[] = [];
  dough: PreparationStep[] = [];
  decoration: PreparationStep[] = [];
}

@Component({
  selector: 'app-recipy-full-view',
  templateUrl: './recipy-full-view.component.html',
  styleUrls: ['./recipy-full-view.component.scss'],
})
export class RecipyFullViewComponent implements OnInit, OnDestroy {
  recipyId!: string;
  recipy!: Recipy;
  destroy$ = new Subject();

  constructor(
    private recipiesService: RecipiesService,
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router,
    private store: Store
  ) {
    const path = window.location.pathname.split('/');
    this.recipyId = path[path.length - 1];
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {
    this.store.dispatch(new SetIsLoadingAction());
    this.getRecipy(this.recipyId);
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let splitUrl = event.url.split('/');
        let newId = splitUrl[splitUrl.length - 1];
        if (newId !== this.recipyId) {
          this.recipyId = newId;
          this.getRecipy(this.recipyId);
        }
      }
    });
  }

  getRecipy(recipyId: string) {
    //TODO recipy can be passed as router data, not need for api request
    this.recipiesService
      .getRecipyById(recipyId)
      .pipe(take(1))
      .subscribe((recipy) => {
        this.recipy = recipy;
        recipy.id = recipyId;
        this.store.dispatch(new SetIsLoadingFalseAction());
      });
  }

  getMode() {
    let mode: string = '';
    if (this.userService.currentUser.email === this.recipy?.author) {
      mode = 'edit';
    } else if (this.recipy?.clonedBy) {
      if (this.userService.currentUser.email === this.recipy.clonedBy) {
        mode = 'edit';
      }
    } else {
      mode = 'clone';
    }
    return mode;
  }
}
