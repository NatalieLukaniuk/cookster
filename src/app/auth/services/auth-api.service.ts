import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/users`;
  constructor(private http: HttpClient) {}

  addUser(user: any) {
    return this.http.post(`${this.url}.json`, user);
  }

  getUsers(){
    return this.http.get(`${this.url}.json`)
  }

  updateUser(id: string, data: any){
    return this.http.patch(`${this.url}/${id}.json`, data)
  }
}
