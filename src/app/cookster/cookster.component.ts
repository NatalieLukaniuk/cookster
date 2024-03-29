import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { LayoutService } from '../shared/services/layout.service';

@Component({
  selector: 'app-cookster',
  templateUrl: './cookster.component.html',
  styleUrls: ['./cookster.component.scss']
})
export class CooksterComponent implements OnInit {
  isMobile$: Observable<boolean>;
  isShowDesktopActionsPane: boolean = true;
  isDesktopActionsPaneExpanded: boolean = false


  constructor(private layoutService: LayoutService, private router: Router) { 
    this.isMobile$ = this.layoutService.isMobile$;
  }

  ngOnInit() {
    this.router.events.subscribe(res => {
      if(res instanceof NavigationEnd){
        if(res.url == '/cookster/recipies/edit-recipy'){
          this.isShowDesktopActionsPane = false;
        } else {
          this.isShowDesktopActionsPane = true;
        }
      }
    })    
  }

}
