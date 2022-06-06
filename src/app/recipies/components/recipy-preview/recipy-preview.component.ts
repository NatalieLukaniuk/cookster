import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { ComplexityDescription } from '../../models/complexity.enum';
import { DishType } from '../../models/dishType.enum';
import { GetUkrIngredientsGroup, Ingredient } from '../../models/ingredient.interface';
import { PreparationStep } from '../../models/preparationStep.interface';
import { NewRecipy, Recipy } from '../../models/recipy.interface';
import { IngredientsByGroup, ingredientsByGroup, StepsByGroup, stepsByGroup } from '../../containers/recipy-full-view/recipy-full-view.component';
import { RecipyMode } from '../../containers/edit-recipy/edit-recipy.component';
import { Store } from '@ngrx/store';
import * as fromRecipiesActions from '../../../store/actions/recipies.actions';
import * as _ from 'lodash';
import { RecipiesService } from '../../services/recipies.service';
import { filter, template } from 'lodash';


@Component({
  selector: 'app-recipy-preview',
  templateUrl: './recipy-preview.component.html',
  styleUrls: ['./recipy-preview.component.scss']
})
export class RecipyPreviewComponent implements OnInit, OnDestroy, OnChanges {

  @Input() recipy!: NewRecipy | Recipy;
  @Input() mode: RecipyMode = RecipyMode.ViewRecipy;
  RecipyMode = RecipyMode;

  isMobile: boolean = false;
  destroy$ = new Subject();

  portionsToServe: number | undefined;
  ingredientsByGroup: IngredientsByGroup = new ingredientsByGroup();
  stepsByGroup: StepsByGroup = new stepsByGroup();
  isSplitToGroups: boolean = false;

  isChangesSaved: boolean = true;
  isAddIngredientFormShown: boolean = false;

  _clonedRecipy: Recipy | NewRecipy | undefined;

  GetUkrIngredientsGroup = GetUkrIngredientsGroup;

  currentTab: string = 'ingredients';

  AVERAGE_PORTION: number = 250;


  constructor(private layoutService: LayoutService, private store: Store, private recipiesService: RecipiesService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (!!this.recipy.ingrediends.length) {
      this.portionsToServe = this.savedPortionsServed;
    }
    if (this.recipy.isSplitIntoGroups && !!this.recipy.isSplitIntoGroups.length) {
      this.isSplitToGroups = true;
      this.getIngredientsByGroup();
      this.getStepsByGroup()
    }
  }

  ngOnInit(): void {

    this._clonedRecipy = _.cloneDeep(this.recipy)

    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => (this.isMobile = bool));
    if (!!this._clonedRecipy.ingrediends.length) {
      this.portionsToServe = this.savedPortionsServed;
    }
    if (this._clonedRecipy.isSplitIntoGroups && !!this._clonedRecipy.isSplitIntoGroups.length) {
      this.isSplitToGroups = true;
      this.getIngredientsByGroup();
      this.getStepsByGroup()
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
        amount = ingr.amount + amount;
      }
      portions = Math.floor(amount / this.AVERAGE_PORTION);
    }

    return portions;
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

  getIngredientsByGroup() {
    if (!!this._clonedRecipy && this._clonedRecipy.isSplitIntoGroups) {
      let ingredients = this._clonedRecipy.ingrediends
      this._clonedRecipy.isSplitIntoGroups.forEach(group => {
        this.ingredientsByGroup[group] = ingredients.filter(ingredient => ingredient.group == group)
      });
    }
  }

  getStepsByGroup() {
    if (this._clonedRecipy && this._clonedRecipy.isSplitIntoGroups) {
      let steps = this._clonedRecipy?.steps
      this._clonedRecipy.isSplitIntoGroups.forEach(group => {
        this.stepsByGroup[group] = steps.filter(step => step.group == group)
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
    return step.timeActive + step.timePassive;
  }

  get activeTime() {
    let time = 0;
    if (this._clonedRecipy) {
      for (let step of this._clonedRecipy.steps) {
        time = time + step.timeActive;
      }
    }

    return time;
  }

  get passiveTime() {
    let time = 0;
    if (this._clonedRecipy) {
      for (let step of this._clonedRecipy.steps) {
        time = time + step.timePassive;
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
    this.currentTab = event.value;
  }

  onPortionsChange(option: number) {
    this.portionsToServe = option;
  }

  get complexity() {
    if (this._clonedRecipy) {
      return ComplexityDescription[this._clonedRecipy.complexity];
    } else return '';
  }

  goBack() {

  }

  editRecipy() {

  }
  onAddRecipy() {
    if (this._clonedRecipy) {
      this.store.dispatch(new fromRecipiesActions.AddNewRecipyAction(this._clonedRecipy))
    }
  }

  onEditRecipy() {
    this.mode = RecipyMode.EditRecipy
  }

  saveUpdatedRecipy() {
    console.log(this._clonedRecipy)
    this.mode = RecipyMode.ViewRecipy
  }

  other() {
    console.log(this.recipy)
    console.log(this.mode)
  }
  onIngredientChanged(event: Ingredient) {
    if (!!this._clonedRecipy) {
      this._clonedRecipy.ingrediends = this._clonedRecipy?.ingrediends.map(ingr => {
        if (ingr.product == event.product) {
          return event
        } else return ingr;
      })
    }
    this.isChangesSaved = false;
  }

  onDeleteIngredient(event: Ingredient) {
    if (!!this._clonedRecipy) {
      this._clonedRecipy.ingrediends = this._clonedRecipy.ingrediends.filter(ingr => {
        if ('group' in ingr) {
          return !(ingr.group == event.group && ingr.product == event.product)
        } else {
          return !(ingr.product == event.product)
        }
      })
    }
    this.getIngredientsByGroup();
    this.isChangesSaved = false;
  }

  onaAddNewIngredient(event: Ingredient) {
    let ingr: Ingredient = {
      product: this.recipiesService.getIngredientIdFromName(event),
      amount: event.amount,
      defaultUnit: event.defaultUnit
    }
    ingr.amount = this.recipiesService.transformToGr(ingr)
    if ('group' in event && event.group) {
      ingr.group = event.group;
      if (!!this._clonedRecipy && !this._clonedRecipy.isSplitIntoGroups.includes(ingr.group)) {
        this._clonedRecipy.isSplitIntoGroups.push(event.group)
      }
    }
    this._clonedRecipy?.ingrediends.push(ingr)
    this.isAddIngredientFormShown = false;
    this.getIngredientsByGroup();
    this.isChangesSaved = false
  }
  onTagsSelectionChange(event: DishType[]) {
    this.isChangesSaved = false
    if (this._clonedRecipy) {
      this._clonedRecipy.type = event
    }
  }
  onDeleteStep(step: PreparationStep){
    console.log(step)
    if(this._clonedRecipy){
      this._clonedRecipy.steps = this._clonedRecipy.steps.filter(item => item.id !== step.id)
      this.getStepsByGroup()
    }
  }
}
