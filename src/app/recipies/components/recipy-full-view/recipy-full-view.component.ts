import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ComplexityDescription } from '../../models/complexity.enum';
import { DishType } from '../../models/dishType.enum';
import { PreparationStep } from '../../models/preparationStep.interface';
import { Recipy } from '../../models/recipy.interface';
import { AddRecipyComponent } from '../add-recipy/add-recipy.component';
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

  currentTab: string = 'ingredients';

  constructor(
    // public dialogRef: MatDialogRef<RecipyFullViewComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: Recipy,
    private layoutService: LayoutService,
    private recipiesService: RecipiesService,
    public dialog: MatDialog,
  ) {
    const path = window.location.pathname.split('/');
    this.recipyId = path[path.length - 1];
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {    
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => (this.isMobile = bool));
    this.getRecipy(this.recipyId);
  }

  getRecipy(recipyId: string){
    this.recipiesService
    .getRecipyById(recipyId)
    .pipe(take(1))
    .subscribe((recipy) => {
      this.recipy = recipy;
      recipy.id = recipyId;
      this.portionsToServe = this.savedPortionsServed;
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
      for (let i = 1; i <= 20; i++) {
        portionsArray.push(i);
      }
    }
    return portionsArray;
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

  editRecipy(){
    const dialogRef = this.dialog.open(AddRecipyComponent, {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      position: { bottom: '0' },
      hasBackdrop: false,
      panelClass: 'full-recipy-dialog',
      autoFocus: false,
      data: {
        mode: 'edit',
        recipy: this.recipy
      }
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: Recipy) => {
        if(result?.id){
          this.recipiesService.editRecipy(result.id, result);
        }        
      });
  }
}

//TODO chips: figure out what should happen on click on tag chip
