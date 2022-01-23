import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  isMobile$ = new BehaviorSubject<boolean>(false);

constructor() { }

}
