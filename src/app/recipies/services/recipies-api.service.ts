import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NewRecipy, Recipy } from './../models/recipy.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipiesApiService {
  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/recipies`;

  constructor(private http: HttpClient) {}

  addRecipy(recipy: NewRecipy) {
    return this.http.post(`${this.url}.json`, recipy);
  }

  updateRecipy(id: string, data: any){
    return this.http.patch<Recipy>(`${this.url}/${id}.json`, data);
  }

  getRecipies(): Observable<Recipy[]> {
    return this.http.get<Recipy[]>(`${this.url}.json`);
  }

  getRecipyById(id: string) {
    return this.http.get<Recipy>(`${this.url}/${id}.json`);
  }

  deleteRecipy(id: string) {
    return this.http.delete<Recipy>(`${this.url}/${id}.json`);
  }
}
