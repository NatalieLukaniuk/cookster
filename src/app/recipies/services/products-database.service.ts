import { Injectable } from '@angular/core';

import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsDatabaseService {
  products: Product[] = [
    { id: 1, name: 'помідор', density: 600, grInOneItem: 150, calories: 24 }, // density is in kg/dm3
    { id: 2, name: 'картопля', density: 750, grInOneItem: 185, calories: 77 },
    { id: 3, name: 'оливкова олія', density: 914, calories: 898 },
    { id: 4, name: 'сіль', density: 2165, calories: 0 },
  ];
}
