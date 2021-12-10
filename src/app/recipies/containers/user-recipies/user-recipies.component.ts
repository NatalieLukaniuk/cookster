import { Component, OnInit } from '@angular/core';
import { Recipy } from 'src/app/recipies/models/recipy.interface';

import { RecipiesDatabaseService } from '../../services/recipies-database.service';

@Component({
  selector: 'app-user-recipies',
  templateUrl: './user-recipies.component.html',
  styleUrls: ['./user-recipies.component.scss']
})
export class UserRecipiesComponent implements OnInit {
userRecipies: Recipy[] = [];
  constructor(private mockRecipies: RecipiesDatabaseService) { }

  ngOnInit() {
    this.userRecipies = this.mockRecipies.recipies;
  }

}
