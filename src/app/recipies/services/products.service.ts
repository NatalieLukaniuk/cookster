import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { ProductsApiService } from './products-api.service';
import { Product } from './products-database.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products$ = new BehaviorSubject<Product[]>([])
  productsUpdated$ = new Subject<any>()

  constructor(private api: ProductsApiService) {}

  processAddNewProduct(product: Product) {
    this.api.addProduct(product).subscribe((res) => {
      this.productsUpdated$.next();
    });
  }

  getAllProducts() {
    return this.api.getProducts().pipe(take(1)).subscribe(res => {
      let array = Object.entries(res);
      let products: any = [];
      for (let entry of array) {
        let recipy: any = {
          id: entry[0],
          ...entry[1],
        };
        products.push(recipy);
      }
      this.products$.next(products)
    });
  }

  deleteProduct(product: Product){
    this.api.deleteProduct(product).pipe(take(1)).subscribe(res => this.productsUpdated$.next())
  }
}
