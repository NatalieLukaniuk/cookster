import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { LayoutService } from '../shared/services/layout.service';

@Component({
  selector: 'app-cookster',
  templateUrl: './cookster.component.html',
  styleUrls: ['./cookster.component.scss']
})
export class CooksterComponent implements OnInit {
  isMobile$: Observable<boolean>;

  constructor(private layoutService: LayoutService) { 
    this.isMobile$ = this.layoutService.isMobile$;
  }

  ngOnInit() {
    
  }

}
