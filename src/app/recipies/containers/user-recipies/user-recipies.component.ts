import { Component, OnInit } from '@angular/core';
import { Recipy } from 'src/app/recipies/models/recipy.interface';

import { RecipiesApiService } from '../../services/recipies-api.service';

@Component({
  selector: 'app-user-recipies',
  templateUrl: './user-recipies.component.html',
  styleUrls: ['./user-recipies.component.scss']
})
export class UserRecipiesComponent implements OnInit {
userRecipies: Recipy[] = [];
  constructor(private apiService: RecipiesApiService) { }

  ngOnInit() {
    this.getRecipies()
  }

  getRecipies(){
    this.apiService.getRecipies().subscribe(res => {
      let array = Object.entries(res);
      let recipies:any = [];
      for (let entry of array){
        let recipy: any = {
          id: entry[0],
          ...entry[1]          
        }
        recipies.push(recipy)
      }
      this.userRecipies = recipies;
    })
  }

}
