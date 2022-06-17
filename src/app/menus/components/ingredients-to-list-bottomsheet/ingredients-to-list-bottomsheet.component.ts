import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';

@Component({
  selector: 'app-ingredients-to-list-bottomsheet',
  templateUrl: './ingredients-to-list-bottomsheet.component.html',
  styleUrls: ['./ingredients-to-list-bottomsheet.component.scss']
})
export class IngredientsToListBottomsheetComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {ingredients: Ingredient[]}) { }

  ngOnInit(): void {
    console.log(this.data.ingredients)
  }

}
