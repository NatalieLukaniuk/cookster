import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

export interface StepsByGroup {
  main: PreparationStep[];
  filling: PreparationStep[];
  souce: PreparationStep[];
  dough: PreparationStep[];
  decoration: PreparationStep[];
}

export class ingredientsByGroup implements IngredientsByGroup {
  main: Ingredient[] = []
  decoration: Ingredient[] = []
  dough: Ingredient[] = []
  souce: Ingredient[] = []
  filling: Ingredient[] = []
  constructor() { }
};

export class stepsByGroup implements StepsByGroup {
  main: PreparationStep[] = [];
  filling: PreparationStep[] = [];
  souce: PreparationStep[] = [];
  dough: PreparationStep[] = [];
  decoration: PreparationStep[] = [];
  constructor(){}
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
    private userService: UserService
  ) {
    const path = window.location.pathname.split('/');
    this.recipyId = path[path.length - 1];
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {
    this.getRecipy(this.recipyId);
    this.recipiesService.recipiesUpdated$.pipe(takeUntil(this.destroy$)).subscribe(() => { this.getRecipy(this.recipyId) })
  }

  getRecipy(recipyId: string) {
    this.recipiesService
      .getRecipyById(recipyId)
      .pipe(take(1))
      .subscribe((recipy) => {
        this.recipy = recipy;
        recipy.id = recipyId;
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


