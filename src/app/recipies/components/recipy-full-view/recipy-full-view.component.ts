import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ComplexityDescription } from '../../models/complexity.enum';
import { DishType } from '../../models/dishType.enum';
import { PreparationStep } from '../../models/preparationStep.interface';
import { Recipy } from '../../models/recipy.interface';
import { LayoutService } from './../../../shared/services/layout.service';
import { RecipiesService } from './../../services/recipies.service';

@Component({
  selector: 'app-recipy-full-view',
  templateUrl: './recipy-full-view.component.html',
  styleUrls: ['./recipy-full-view.component.scss'],
})
export class RecipyFullViewComponent implements OnInit, OnDestroy {
  recipyId!: string;
  recipy: Recipy | undefined;
  averagePortion: number = 250;

  portionsToServe: number | undefined;

  isMobile: boolean = false;
  destroy$ = new Subject();

  constructor(
    // public dialogRef: MatDialogRef<RecipyFullViewComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: Recipy,
    private layoutService: LayoutService,
    private recipiesService: RecipiesService
  ) {
    
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {
    const path = window.location.pathname.split('/');
    const recipyId = path[path.length - 1];
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => (this.isMobile = bool));
    this.recipiesService
      .getRecipyById(recipyId)
      .pipe(take(1))
      .subscribe((recipy) => {
        this.recipy = recipy;
        this.portionsToServe = this.savedPortionsServed
      });
  }

  goBack(): void {
    // this.dialogRef.close();
  }

  get complexity() {
    if (this.recipy) {
      return ComplexityDescription[this.recipy.complexity];
    } else return '';
  }

  get savedPortionsServed() {
    let portions = 0;
    if (this.recipy) {
      let amount = 0;
      for (let ingr of this.recipy.ingrediends) {
        amount = ingr.amount + amount;
      }
      portions = Math.floor(amount / this.averagePortion);
    }

    return portions;
  }

  get portionsOptions() {
    let portionsArray = [];
    if (this.recipy) {
      for (let i = 1; i <= 10; i++) {
        portionsArray.push(i);
      }
    }

    return portionsArray;
  }

  get portionsText(): string {
    if (this.portionsToServe && this.portionsToServe == 1) {
      return 'порцію';
    } else if (this.portionsToServe && 1 < this.portionsToServe && this.portionsToServe < 5) {
      return 'порції';
    } else if (this.portionsToServe){
      return 'порцій';
    } else return ''
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
}

//TODO chips: figure out what should happen on click on tag chip
//TODO: implement calculation for items measuring unit
