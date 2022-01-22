import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Recipy } from 'src/app/recipies/models/recipy.interface';

import { ProductsService } from '../../services/products.service';
import { RecipiesService } from '../../services/recipies.service';

@Component({
  selector: 'app-user-recipies',
  templateUrl: './user-recipies.component.html',
  styleUrls: ['./user-recipies.component.scss'],
})
export class UserRecipiesComponent implements OnInit {
  userRecipies: Recipy[] = [];
  constructor(
    private recipies: RecipiesService,
    private products: ProductsService
  ) {}

  ngOnInit() {
    this.getRecipies();
    this.getProducts();
    this.recipies.newRecipyAdded.subscribe(() => this.getRecipies());
  }

  getRecipies() {
    this.recipies
      .getAllRecipies()
      .pipe(take(1))
      .subscribe((res) => {
        let array = Object.entries(res);
        let recipies: any = [];
        for (let entry of array) {
          let recipy: any = {
            id: entry[0],
            ...entry[1],
          };
          recipies.push(recipy);
        }
        this.userRecipies = recipies;
      });
  }

  getProducts() {
    this.products.getAllProducts();
  }
}
