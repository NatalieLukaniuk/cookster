import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, Location } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.interface';
import { CalendarService } from 'src/app/calendar/services/calendar.service';
import { AVERAGE_PORTION } from 'src/app/shared/constants';
import { DialogsService } from 'src/app/shared/services/dialogs.service';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

import * as fromRecipiesActions from '../../../store/actions/recipies.actions';
import { AppMode } from '../../containers/edit-recipy/edit-recipy.component';
import {
  IngredientsByGroup,
  ingredientsByGroup,
} from '../../containers/recipy-full-view/recipy-full-view.component';
import { ComplexityDescription } from '../../models/complexity.enum';
import { DishType } from '../../models/dishType.enum';
import {
  GetUkrIngredientsGroup,
  Ingredient,
} from '../../models/ingredient.interface';
import { PreparationStep } from '../../models/preparationStep.interface';
import { NewRecipy, Recipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';
import { getPreviousRoute } from './../../../store/selectors/ui.selectors';

@Component({
  selector: 'app-recipy-preview',
  templateUrl: './recipy-preview.component.html',
  styleUrls: ['./recipy-preview.component.scss'],
})
export class RecipyPreviewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() recipy!: NewRecipy | Recipy;
  @Input() mode: AppMode = AppMode.ViewRecipy;
  @Input() portions?: number;
  @Input() amountPerPortion?: number;
  AppMode = AppMode;

  isMobile: boolean = false;
  destroy$ = new Subject();

  portionsToServe: number | undefined;
  ingredientsByGroup: IngredientsByGroup = new ingredientsByGroup();
  isSplitToGroups: boolean = false;

  isChangesSaved: boolean = true;
  isAddIngredientFormShown: boolean = false;
  isAddStepFormShown: boolean = false;

  currentUser: User | undefined;

  _clonedRecipy: Recipy | NewRecipy | undefined;
  recipyId: string | undefined;

  GetUkrIngredientsGroup = GetUkrIngredientsGroup;

  currentTab: string = 'ingredients';

  portionSize: number = AVERAGE_PORTION;

  coeficient: number = 1;

  selectedStepId = 0;

  isPreviousRoute$: Observable<boolean>;

  constructor(
    private layoutService: LayoutService,
    private store: Store<IAppState>,
    private recipiesService: RecipiesService,
    private dialogsService: DialogsService,
    private calendarService: CalendarService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isPreviousRoute$ = this.store.pipe(
      select(getPreviousRoute),
      map((route) => !!route.length && route !== 'login')
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!!this.recipy.ingrediends.length) {
      this.portionsToServe = this.savedPortionsServed;
    }
    if (
      this.recipy.isSplitIntoGroups &&
      !!this.recipy.isSplitIntoGroups.length
    ) {
      this.isSplitToGroups = true;
      this.getIngredientsByGroup();
    }

    if (changes.recipy.currentValue) {
      this.initRecipy();
      this.getCoeficient();
    }
  }

  ngOnInit(): void {
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => (this.isMobile = bool));

    this.store
      .pipe(select(getCurrentUser), takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
        }
      });
    this.initRecipy();
    this.getCoeficient();
  }

  initRecipy() {
    let navigationData = this.location.getState() as {
      portions?: number;
      amountPerportion?: number;
    };
    if (!!navigationData.portions) {
      this.portionsToServe = navigationData.portions;
    }

    if (!!navigationData.amountPerportion) {
      this.portionSize = navigationData.amountPerportion;
    }

    if (this.portions) {
      this.portionsToServe = this.portions;
    }
    if (this.amountPerPortion) {
      this.portionSize = this.amountPerPortion;
    }

    this._clonedRecipy = _.cloneDeep(this.recipy);
    if (
      !!this._clonedRecipy.ingrediends.length &&
      !navigationData.portions &&
      !this.portions
    ) {
      this.portionsToServe = this.savedPortionsServed;
    }
    if (
      this._clonedRecipy.isSplitIntoGroups &&
      !!this._clonedRecipy.isSplitIntoGroups.length
    ) {
      this.isSplitToGroups = true;
      this.getIngredientsByGroup();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  get savedPortionsServed() {
    let portions = 0;
    if (this._clonedRecipy) {
      let amount = 0;
      for (let ingr of this._clonedRecipy.ingrediends) {
        if (
          this.recipiesService.getIsIngredientInDB(ingr.product) &&
          this.recipiesService.getIsIngredientIncludedInAmountCalculation(ingr)
        ) {
          amount = ingr.amount + amount;
        }
      }
      portions = Math.floor(amount / this.portionSize);
    }
    if (portions < 1) {
      portions = 1;
    }
    return portions;
  }

  getCoeficient() {
    if (this._clonedRecipy && this.portionsToServe) {
      let amount = 0;
      for (let ingr of this._clonedRecipy.ingrediends) {
        if (
          this.recipiesService.getIsIngredientInDB(ingr.product) &&
          this.recipiesService.getIsIngredientIncludedInAmountCalculation(ingr)
        ) {
          amount = ingr.amount + amount; // amount of ingreds with calories
        }
      }
      this.coeficient = (this.portionsToServe * this.portionSize) / amount;
    }
  }

  get portionsOptions() {
    let portionsArray = [];
    if (this.recipy) {
      for (let i = 1; i <= 20; i++) {
        portionsArray.push(i);
      }
    }
    return portionsArray;
  }

  onPortionsNumberChanged() {
    this.getCoeficient();
  }

  onportionSizeChanged() {
    this.getCoeficient();
  }

  getIngredientsByGroup() {
    if (!!this._clonedRecipy && this._clonedRecipy.isSplitIntoGroups) {
      let ingredients = this._clonedRecipy.ingrediends;
      this._clonedRecipy.isSplitIntoGroups.forEach((group) => {
        this.ingredientsByGroup[group] = ingredients.filter(
          (ingredient) => ingredient.group == group
        );
      });
    }
  }

  get portionsText(): string {
    if (this.portionsToServe && this.portionsToServe == 1) {
      return 'порцію';
    } else if (
      this.portionsToServe &&
      1 < this.portionsToServe &&
      this.portionsToServe < 5
    ) {
      return 'порції';
    } else if (this.portionsToServe) {
      return 'порцій';
    } else return '';
  }

  getTotalStepTime(step: PreparationStep) {
    return +step.timeActive + +step.timePassive;
  }

  get activeTime() {
    let time = 0;
    if (this._clonedRecipy) {
      for (let step of this._clonedRecipy.steps) {
        time = time + +step.timeActive;
      }
    }

    return time;
  }

  get passiveTime() {
    let time = 0;
    if (this._clonedRecipy) {
      for (let step of this._clonedRecipy.steps) {
        time = time + +step.timePassive;
      }
    }

    return time;
  }

  get tags() {
    let tags: string[] = [];
    if (this._clonedRecipy) {
      this._clonedRecipy.type.forEach((tag: DishType) => {
        tags.push(DishType[tag]);
      });
    }
    return tags;
  }

  get allTags() {
    let tags: number[] = [];
    tags = Object.values(DishType).filter(
      (value) => typeof value === 'number'
    ) as number[];
    return tags;
  }
  onMatToggleChange(event: any) {
    if (event.value === 'back') {
      this.goBack();
    } else {
      this.currentTab = event.value;
    }
  }

  onPortionsChange(option: number) {
    this.portionsToServe = option;
    this.onPortionsNumberChanged();
  }

  get complexity() {
    if (this._clonedRecipy) {
      return ComplexityDescription[this._clonedRecipy.complexity];
    } else return '';
  }

  onAddRecipy() {
    if (this._clonedRecipy) {
      this._clonedRecipy.createdOn = Date.now();
      if (
        this._clonedRecipy.ingrediends.find(
          (ingredient) =>
            !this.recipiesService.getIsIngredientInDB(ingredient.product)
        )
      ) {
        this._clonedRecipy.notApproved = true;
      }
      this.store.dispatch(
        new fromRecipiesActions.AddNewRecipyAction(this._clonedRecipy)
      );
    }
  }

  onEditRecipy() {
    this.mode = AppMode.EditRecipy;
  }

  saveUpdatedRecipy() {
    if (this._clonedRecipy && this.currentUser && 'id' in this._clonedRecipy) {
      this.recipiesService.saveUpdatedRecipy(
        this._clonedRecipy,
        this.currentUser.email
      );
    }
    this.portionsToServe = this.savedPortionsServed;
    this.mode = AppMode.ViewRecipy;
  }

  other() {
    console.log(this.recipy);
    console.log(this.mode);
  }
  onIngredientChanged(event: Ingredient) {
    if (!!this._clonedRecipy) {
      this._clonedRecipy.ingrediends = this._clonedRecipy?.ingrediends.map(
        (ingr) => {
          if (ingr.product == event.product) {
            return event;
          } else return ingr;
        }
      );
    }
    this.isChangesSaved = false;
  }

  onDeleteIngredient(event: Ingredient) {
    if (!!this._clonedRecipy) {
      this._clonedRecipy.ingrediends = this._clonedRecipy.ingrediends.filter(
        (ingr) => {
          if ('group' in ingr) {
            return !(
              ingr.group == event.group && ingr.product == event.product
            );
          } else {
            return !(ingr.product == event.product);
          }
        }
      );
    }
    this.getIngredientsByGroup();
    this.isChangesSaved = false;
  }

  onaAddNewIngredient(event: Ingredient) {
    let ingr: Ingredient = {
      product: this.recipiesService.getIngredientIdFromName(event),
      amount: event.amount,
      defaultUnit: event.defaultUnit,
    };
    ingr.amount = this.recipiesService.transformToGr(ingr, event.amount);
    if ('group' in event && event.group) {
      ingr.group = event.group;
      if (
        !!this._clonedRecipy &&
        !this._clonedRecipy.isSplitIntoGroups.includes(ingr.group)
      ) {
        this._clonedRecipy.isSplitIntoGroups.push(event.group);
      }
    }
    this._clonedRecipy?.ingrediends.push(ingr);
    this.isAddIngredientFormShown = false;
    this.getIngredientsByGroup();
    this.isChangesSaved = false;
  }
  onTagsSelectionChange(event: DishType[]) {
    this.isChangesSaved = false;
    if (this._clonedRecipy) {
      this._clonedRecipy.type = event;
    }
  }
  onDeleteStep(step: PreparationStep) {
    if (this._clonedRecipy) {
      this._clonedRecipy.steps = this._clonedRecipy.steps.filter(
        (item) => item.id !== step.id
      );
    }
    this.isChangesSaved = false;
  }

  onStepDescriptionEdited(step: PreparationStep) {
    if (this._clonedRecipy) {
      this._clonedRecipy.steps = this._clonedRecipy.steps.map((item) => {
        if (item.id == step.id) {
          return step;
        } else return item;
      });
    }
    this.isChangesSaved = false;
  }

  //TODO make the textareas for preparation steps in edit mode auto-adjust to text height - a separate component for that

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
    this._clonedRecipy?.steps.push(step);
    this.isAddStepFormShown = false;
    this.isChangesSaved = false;
  }

  pipe = new DatePipe('en-US');
  onDateChanged(event: any) {
    let day = this.pipe.transform(event.jsdate, 'ddMMYYYY');
    this.dialogsService
      .openMealTimeSelectionDialog()
      .pipe(take(1))
      .subscribe(
        (res: { meal: string; portions: number; amountPerPortion: number }) => {
          if (!!this.currentUser && !!res) {
            let userToSave: User = _.cloneDeep(this.currentUser);
            if (!!day && 'id' in this.recipy) {
              this.calendarService.saveRecipyToCalendar(
                userToSave,
                day,
                this.recipy.id,
                res.meal,
                res.portions,
                res.amountPerPortion
              );
            }
          }
        }
      );
  }

  drop(event: CdkDragDrop<PreparationStep[]>) {
    if (this._clonedRecipy) {
      moveItemInArray(
        this._clonedRecipy.steps,
        event.previousIndex,
        event.currentIndex
      );
      this.isChangesSaved = false;
    }
  }

  // dropSplitToGroups(event: CdkDragDrop<PreparationStep[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  //   // let changedStepsByGroup: StepsByGroup = {
  //   //   main: this.mapStepsByGroup('main'),
  //   //   filling: this.mapStepsByGroup('filling'),
  //   //   souce: this.mapStepsByGroup('souce'),
  //   //   dough: this.mapStepsByGroup('dough'),
  //   //   decoration: this.mapStepsByGroup('decoration'),
  //   // };
  //   if (this._clonedRecipy) {
  //     let updatedSteps: PreparationStep[] = [];
  //     Object.values(changedStepsByGroup).forEach(
  //       (ar) => (updatedSteps = updatedSteps.concat(ar))
  //     );
  //     this._clonedRecipy.steps = updatedSteps;
  //   }
  //   this.isChangesSaved = false;
  // }

  // mapStepsByGroup(key: string): PreparationStep[] {
  //   return this.stepsByGroup[key].map(
  //     (item: PreparationStep) => ({ ...item, group: key } as PreparationStep)
  //   );
  // }

  onFileUploaded(event: string) {
    if (this._clonedRecipy) {
      this._clonedRecipy.photo = event;
      this.isChangesSaved = false;
    }
  }
  goBack() {
    this.store.pipe(select(getPreviousRoute), take(1)).subscribe((route) => {
      switch (route) {
        case 'all-recipies':
          this.router.navigate(['/'], { relativeTo: this.route });
          break;
        case 'calendar':
          this.router.navigate(['calendar']);
          break;
        case 'calendar-by-day':
          this.router.navigate(['calendar-by-day']);
      }
    });
  }
}
