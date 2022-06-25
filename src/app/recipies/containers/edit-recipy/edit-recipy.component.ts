import { Component, OnInit } from '@angular/core';

import { NewRecipy } from '../../models/recipy.interface';

export enum AppMode {
  AddRecipy = 'add',
  AddPreview = 'add-preview',
  EditRecipy = 'edit',
  CloneRecipy = 'clone',
  ViewRecipy = 'view',
  AddIngrToShoppingList = 'addIngredientsToShoppingList',
  ShoppingList = 'shoppingList'
}

@Component({
  selector: 'app-edit-recipy',
  templateUrl: './edit-recipy.component.html',
  styleUrls: ['./edit-recipy.component.scss']
})
export class EditRecipyComponent implements OnInit {

  mode: AppMode = AppMode.AddRecipy;

  AppMode = AppMode;

  recipy: NewRecipy | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  previewNewRecipy(event: NewRecipy) {
    this.mode = AppMode.AddPreview;
    if (event) {
      this.recipy = event;
    }
  }

}
