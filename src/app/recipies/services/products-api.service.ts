import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Product } from './products-database.service';



@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/products`;
  constructor(private http: HttpClient) {}

  addProduct(product: Product) {
    return this.http.post(`${this.url}.json`, product);
  }

  getProducts(){
    return this.http.get(`${this.url}.json`);
  }
}
