import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Recipy } from './../models/recipy.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipiesApiService {
  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/recipies`;

  constructor(private http: HttpClient) {}

  addRecipy(recipy: Recipy) {
    return this.http.post(`${this.url}.json`, recipy);
  }

  updateRecipy(id: string, data: any){

  }

  getRecipies() {
    return this.http.get(`${this.url}.json`);
  }

  getRecipyById(id: string) {
    return this.http.get<Recipy>(`${this.url}/${id}.json`);
  }
}
