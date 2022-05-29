import { Component, OnInit } from '@angular/core';
import { NewRecipy, Recipy } from '../../models/recipy.interface';

export enum RecipyMode {
  AddRecipy,
  EditRecipy,
  CloneRecipy,
}

@Component({
  selector: 'app-edit-recipy',
  templateUrl: './edit-recipy.component.html',
  styleUrls: ['./edit-recipy.component.scss']
})
export class EditRecipyComponent implements OnInit {

  mode: RecipyMode = RecipyMode.AddRecipy;

  RecipyMode = RecipyMode;

  recipy: NewRecipy | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  previewNewRecipy(event: NewRecipy) {
    this.mode = RecipyMode.EditRecipy;
    if (event) {
      this.recipy = event;
    }
  }

}
