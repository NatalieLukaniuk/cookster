import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsDatabaseService {
  products: Product[] = [
    { id: 1, name: 'помідор', density: 0.6, grInOneItem: 150, calories: 24 },
    { id: 2, name: 'картопля', density: 0.75, grInOneItem: 185, calories: 77 },
    { id: 3, name: 'оливкова олія', density: 0.914, calories: 898 },
    { id: 4, name: 'сіль', density: 2.165, calories: 0 },
  ];
}
