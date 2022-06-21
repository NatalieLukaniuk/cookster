import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipyForCalendar } from 'src/app/recipies/models/recipy.interface';

import {
  IngredientsToListBottomsheetComponent,
} from '../ingredients-to-list-bottomsheet/ingredients-to-list-bottomsheet.component';

@Component({
  selector: 'app-calendar-recipy',
  templateUrl: './calendar-recipy.component.html',
  styleUrls: ['./calendar-recipy.component.scss']
})
export class CalendarRecipyComponent implements OnInit {

  @Input() isMobile: boolean = false;
  @Input() recipy!: RecipyForCalendar;

  @Output() removeRecipy = new EventEmitter<RecipyForCalendar>()
  @Output() recipyUpdated = new EventEmitter<RecipyForCalendar>()

  constructor(private router: Router,
    private route: ActivatedRoute, private _bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
  }
  viewRecipy() {
    this.router.navigate(['cookster', 'recipies', 'full-recipy', this.recipy.id], {
      relativeTo: this.route.parent,
      state: {
        portions: this.recipy.portions,
        amountPerportion: this.recipy.amountPerPortion
      }
    });
  }

  onRemoveRecipy(){
    this.removeRecipy.emit(this.recipy)
  }

  addToShoppingList(){
    const bottomSheetRef = this._bottomSheet.open(IngredientsToListBottomsheetComponent, {
      data: { ingredients: this.recipy.ingrediends, portions: this.recipy.portions, amountPerPortion: this.recipy.amountPerPortion, isMobile: this.isMobile },
    });
  }

  onAmountPerPortionChanged(){
    this.recipyUpdated.emit(this.recipy)
  }
}
