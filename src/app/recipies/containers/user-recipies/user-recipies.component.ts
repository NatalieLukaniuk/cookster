import { Component, OnInit } from '@angular/core';

import { Recipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';

@Component({
  selector: 'app-user-recipies',
  templateUrl: './user-recipies.component.html',
  styleUrls: ['./user-recipies.component.scss'],
})
export class UserRecipiesComponent implements OnInit {
  userRecipies: Recipy[] = [];
  constructor(
    private recipies: RecipiesService
  ) {}

  ngOnInit() {
    this.recipies.newRecipyAdded.subscribe(() => this.recipies.getRecipies());
    this.recipies.userRecipies$.subscribe(recipies => {
      this.userRecipies = recipies;
    })
  }

}
