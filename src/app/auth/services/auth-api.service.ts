import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';

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

  updateUser(id: string, data: any): Observable<User>{
    return this.http.patch<User>(`${this.url}/${id}.json`, data)
  }
}
