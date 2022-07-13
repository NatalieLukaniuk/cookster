import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.interface';
import { UserService } from 'src/app/auth/services/user.service';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { IUserState } from 'src/app/store/reducers/user.reducer';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

import {
  IngredientsByGroup,
  ingredientsByGroup,
  StepsByGroup,
  stepsByGroup,
} from '../../containers/recipy-full-view/recipy-full-view.component';
import { Complexity, ComplexityDescription } from '../../models/complexity.enum';
import { DishType } from '../../models/dishType.enum';
import { Ingredient, IngredientsGroup } from '../../models/ingredient.interface';
import { PreparationStep } from '../../models/preparationStep.interface';
import { emptyRecipy, NewRecipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';
import { AddIngredientComponent } from './add-ingredient/add-ingredient.component';
import { AddStepComponent } from './add-step-form/add-step.component';

@Component({
  selector: 'app-add-recipy',
  templateUrl: './add-recipy.component.html',
  styleUrls: ['./add-recipy.component.scss'],
})
export class AddRecipyComponent implements OnInit {
  newRecipy: NewRecipy = {} as NewRecipy;

  isSplitToGroups: boolean = false;
  destroy$ = new Subject();
  isMobile: boolean = false;

  ingredientsByGroup: IngredientsByGroup = new ingredientsByGroup();
  stepsByGroup: StepsByGroup = new stepsByGroup();

  @ViewChild(AddIngredientComponent)
  addIngredientFrom!: AddIngredientComponent;
  @ViewChild(AddStepComponent) addStepForm!: AddStepComponent;

  @Output() previewRecipy = new EventEmitter<NewRecipy>();

  currentUser: User | undefined;

  isAddIngredientFormShown: boolean = true;
  isAddStepFormShown: boolean = true;

  constructor(
    private userService: UserService,
    private layoutService: LayoutService,
    private recipiesService: RecipiesService,
    private store: Store<IUserState>
  ) {}

  ngOnInit(): void {
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => (this.isMobile = bool));
    this.store.pipe(select(getCurrentUser)).subscribe((res) => {
      if (res) {
        this.currentUser = res;
        this.newRecipy = new emptyRecipy(this.currentUser?.email);
        this.isSplitToGroups = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  stepSelected(event: any) {
    // actions on tab change
  }

  toggleSplitToGroups() {
    if (this.isSplitToGroups) {
      this.newRecipy.isSplitIntoGroups = [IngredientsGroup.Main];
    } else this.newRecipy.isSplitIntoGroups = [];
  }

  getIngredientsByGroup() {
    if (this.newRecipy.isSplitIntoGroups && this.newRecipy.ingrediends) {
      this.newRecipy.isSplitIntoGroups.forEach((group) => {
        this.ingredientsByGroup[group] = this.newRecipy.ingrediends.filter(
          (ingredient) => ingredient.group == group
        );
      });
    }
  }

  getStepsByGroup() {
    if (this.newRecipy.isSplitIntoGroups && !!this.newRecipy.steps.length) {
      this.newRecipy.isSplitIntoGroups.forEach((group) => {
        this.stepsByGroup[group] = this.newRecipy?.steps.filter(
          (step) => step.group == group
        );
      });
    }
  }

  onaAddNewIngredient(event: Ingredient) {
    let ingr: Ingredient = {
      product: this.recipiesService.getIngredientIdFromName(event),
      amount: event.amount,
      defaultUnit: event.defaultUnit,
    };
    if (event.amount) {
      ingr.amount = this.recipiesService.transformToGr(ingr, event.amount);
    }

    if ('group' in event && event.group) {
      ingr.group = event.group;
      if (!this.newRecipy.isSplitIntoGroups.includes(ingr.group)) {
        this.newRecipy.isSplitIntoGroups.push(event.group);
      }
    }
    this.newRecipy.ingrediends = [...this.newRecipy.ingrediends, ingr];
    if (!!this.newRecipy.isSplitIntoGroups.length) {
      this.getIngredientsByGroup();
    }
    this.addIngredientFrom.resetForm();
    this.isAddIngredientFormShown = false;
  }

  getTotalStepTime(step: PreparationStep) {
    return step.timeActive + step.timePassive;
  }

  onAddNewStep(event: PreparationStep) {
    let step: PreparationStep = {
      id: event.id,
      description: event.description,
      timeActive: +event.timeActive,
      timePassive: +event.timePassive,
    };
    if ('group' in event) {
      step.group = event.group;
    }
    this.newRecipy.steps = [...this.newRecipy.steps, step];
    if (!!this.newRecipy.isSplitIntoGroups.length) {
      this.getStepsByGroup();
    }
    this.addStepForm.resetForm();
    this.isAddStepFormShown = false;
  }

  get complexityOptions() {
    return [1, 2, 3];
  }

  getComplexityOptionsText(unit: Complexity) {
    return ComplexityDescription[unit];
  }

  get tags() {
    let tags: number[] = [];
    tags = Object.values(DishType).filter(
      (value) => typeof value === 'number'
    ) as number[];
    return tags;
  }

  onPreviewRecipy() {
    this.previewRecipy.emit(this.newRecipy);
  }

  onTagsSelectionChange(tags: DishType[]) {
    this.newRecipy.type = tags;
  }
}
