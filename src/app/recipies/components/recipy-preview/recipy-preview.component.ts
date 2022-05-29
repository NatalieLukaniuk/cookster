import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { ComplexityDescription } from '../../models/complexity.enum';
import { DishType } from '../../models/dishType.enum';
import { GetUkrIngredientsGroup } from '../../models/ingredient.interface';
import { PreparationStep } from '../../models/preparationStep.interface';
import { NewRecipy, Recipy } from '../../models/recipy.interface';
import { IngredientsByGroup, ingredientsByGroup, StepsByGroup, stepsByGroup } from '../../containers/recipy-full-view/recipy-full-view.component';

@Component({
  selector: 'app-recipy-preview',
  templateUrl: './recipy-preview.component.html',
  styleUrls: ['./recipy-preview.component.scss']
})
export class RecipyPreviewComponent implements OnInit, OnDestroy, OnChanges {

  @Input() recipy!: NewRecipy;

  isMobile: boolean = false;
  destroy$ = new Subject();

  portionsToServe: number | undefined;
  ingredientsByGroup: IngredientsByGroup = new ingredientsByGroup();
  stepsByGroup: StepsByGroup = new stepsByGroup();
  isSplitToGroups: boolean = false;

  GetUkrIngredientsGroup = GetUkrIngredientsGroup;

  currentTab: string = 'ingredients';

  AVERAGE_PORTION: number = 250;


  constructor(private layoutService: LayoutService,) { }
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
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => (this.isMobile = bool));
    if (!!this.recipy.ingrediends.length) {
      this.portionsToServe = this.savedPortionsServed;
    }
    if (this.recipy.isSplitIntoGroups && !!this.recipy.isSplitIntoGroups.length) {
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
    if (this.recipy) {
      let amount = 0;
      for (let ingr of this.recipy.ingrediends) {
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
    if (this.recipy.isSplitIntoGroups && this.recipy) {
      this.recipy.isSplitIntoGroups.forEach(group => {
        this.ingredientsByGroup[group] = this.recipy.ingrediends.filter(ingredient => ingredient.group == group)
      });
    }
  }

  getStepsByGroup() {
    if (this.recipy.isSplitIntoGroups) {
      this.recipy.isSplitIntoGroups.forEach(group => {
        this.stepsByGroup[group] = this.recipy?.steps.filter(step => step.group == group)
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
    if (this.recipy) {
      for (let step of this.recipy.steps) {
        time = time + step.timeActive;
      }
    }

    return time;
  }

  get passiveTime() {
    let time = 0;
    if (this.recipy) {
      for (let step of this.recipy.steps) {
        time = time + step.timePassive;
      }
    }

    return time;
  }

  get tags() {
    let tags: string[] = [];
    if (this.recipy) {
      this.recipy.type.forEach((tag: DishType) => {
        tags.push(DishType[tag]);
      });
    }

    return tags;
  }
  onMatToggleChange(event: any) {
    this.currentTab = event.value;
  }

  onPortionsChange(option: number) {
    this.portionsToServe = option;
  }

  get complexity() {
    if (this.recipy) {
      return ComplexityDescription[this.recipy.complexity];
    } else return '';
  }

  goBack() {

  }

  editRecipy() {

  }
}
