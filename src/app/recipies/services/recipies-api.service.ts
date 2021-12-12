import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipy } from 'src/app/recipies/models/recipy.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipiesApiService {

  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/recipies.json`

constructor(private http: HttpClient) { }

addRecipy(recipy: Recipy){
  return this.http.post(this.url, recipy);
}

getRecipies(){
  return this.http.get(this.url);
}
}
