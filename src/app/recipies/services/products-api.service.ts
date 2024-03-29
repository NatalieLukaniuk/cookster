import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Product } from '../models/products.interface';





@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/products`;
  constructor(private http: HttpClient) {}

  addProduct(product: Product) {
    return this.http.post(`${this.url}.json`, product);
  }

  deleteProduct(product: Product) {
    return this.http.delete(`${this.url}/${product.id}.json` )
  }

  getProducts(){
    return this.http.get(`${this.url}.json`);
  }

  updateProduct(id: string, data: any){
    return this.http.patch<Product>(`${this.url}/${id}.json`, data);
  }
}
