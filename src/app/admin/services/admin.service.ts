import { AdminCommentMapped } from './../containers/comments-to-recipies/comments-to-recipies.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AdminComment {
  recipyId: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/admin`;

  constructor(private http: HttpClient) {}

  addAdminComment(comment: AdminComment): Observable<any> {
    return this.http.post<any>(`${this.url}.json`, comment);
  }

  getAdminComments(): Observable<AdminComment[]> {
    return this.http.get<AdminComment[]>(`${this.url}.json`);
  }

  deleteComment(comment: AdminCommentMapped): Observable<any> {
    return this.http.delete<any>(`${this.url}/${comment.commentId}.json`)
  }
}
