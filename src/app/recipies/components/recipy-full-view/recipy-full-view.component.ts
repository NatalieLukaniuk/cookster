import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ComplexityDescription } from '../../models/complexity.enum';
import { Recipy } from '../../models/recipy.interface';
import { PreparationStep } from './../../models/preparationStep.interface';

@Component({
  selector: 'app-recipy-full-view',
  templateUrl: './recipy-full-view.component.html',
  styleUrls: ['./recipy-full-view.component.scss'],
})
export class RecipyFullViewComponent implements OnInit {

  averagePortion: number = 250;

  portionsToServe: number;

  constructor(
    public dialogRef: MatDialogRef<RecipyFullViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Recipy,
  ) {
    this.portionsToServe = this.savedPortionsServed;
  }

  ngOnInit() {
    
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

  get portionsOptions(){
    let portionsArray = [];
    for (let i = 1; i <= 10; i++){
      portionsArray.push(i);
    }
    return portionsArray;
  }

  get portionsText(): string{
    if (this.portionsToServe == 1){
      return 'порцію'
    } else if (1 < this.portionsToServe && this.portionsToServe < 5){
      return 'порції'
    } else return 'порцій'
  }
  
  getTotalStepTime(step: PreparationStep){
    return step.timeActive + step.timePassive;
  }
}
