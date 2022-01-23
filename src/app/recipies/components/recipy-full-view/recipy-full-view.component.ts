import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ComplexityDescription } from '../../models/complexity.enum';
import { DishType } from '../../models/dishType.enum';
import { Recipy } from '../../models/recipy.interface';
import { LayoutService } from './../../../shared/services/layout.service';
import { PreparationStep } from './../../models/preparationStep.interface';

@Component({
  selector: 'app-recipy-full-view',
  templateUrl: './recipy-full-view.component.html',
  styleUrls: ['./recipy-full-view.component.scss'],
})
export class RecipyFullViewComponent implements OnInit, OnDestroy {
  averagePortion: number = 250;

  portionsToServe: number;

  isMobile: boolean = false;
  destroy$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<RecipyFullViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Recipy,
    private layoutService: LayoutService
  ) {
    this.portionsToServe = this.savedPortionsServed;
  }
  ngOnDestroy(): void {
    this.destroy$.next()
  }

  ngOnInit() {
    this.layoutService.isMobile$.pipe(takeUntil(this.destroy$)).subscribe(bool => this.isMobile = bool)
  }

  goBack(): void {
    this.dialogRef.close();
  }

  get complexity() {
    return ComplexityDescription[this.data.complexity];
  }

  get savedPortionsServed() {
    let amount = 0;
    for (let ingr of this.data.ingrediends) {
      amount = ingr.amount + amount;
    }
    const portions = Math.floor(amount / this.averagePortion);
    return portions;
  }

  get portionsOptions() {
    let portionsArray = [];
    for (let i = 1; i <= 10; i++) {
      portionsArray.push(i);
    }
    return portionsArray;
  }

  get portionsText(): string {
    if (this.portionsToServe == 1) {
      return 'порцію';
    } else if (1 < this.portionsToServe && this.portionsToServe < 5) {
      return 'порції';
    } else return 'порцій';
  }

  getTotalStepTime(step: PreparationStep) {
    return step.timeActive + step.timePassive;
  }

  get activeTime() {
    let time = 0;
    for (let step of this.data.steps) {
      time = time + step.timeActive;
    }
    return time;
  }

  get passiveTime() {
    let time = 0;
    for (let step of this.data.steps) {
      time = time + step.timePassive;
    }
    return time;
  }

  get tags(){
    let tags: string[] = [];
    this.data.type.forEach((tag: DishType) => {
      tags.push(DishType[tag])
    });
    return tags;
  }
}

//TODO chips: figure out what should happen on click on tag chip
//TODO: implement calculation for items measuring unit