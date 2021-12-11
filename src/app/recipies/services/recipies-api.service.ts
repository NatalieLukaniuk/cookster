import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecipiesApiService {

  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/recipies.json`

constructor(private http: HttpClient) { }

addRecipy(){

}

getRecipies(){
  return this.http.get(this.url);
}
}
