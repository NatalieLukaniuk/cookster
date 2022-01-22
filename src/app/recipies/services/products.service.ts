import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { ProductsApiService } from './products-api.service';
import { Product } from './products-database.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products: Product[] = [];

  constructor(private api: ProductsApiService) {}

  processAddNewProduct(product: Product) {
    this.api.addProduct(product).subscribe((res) => {
      console.log(res);
    });
  }

  getAllProducts() {
    return this.api.getProducts().pipe(take(1)).subscribe(res => {
     console.log(res)
    });
  }
}
