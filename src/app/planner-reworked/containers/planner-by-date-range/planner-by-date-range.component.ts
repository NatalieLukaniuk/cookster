import { Component, OnInit } from '@angular/core';

export enum Tabs {
  Planning,
  Shopping,
  Preps,
}
@Component({
  selector: 'app-planner-by-date-range',
  templateUrl: './planner-by-date-range.component.html',
  styleUrls: ['./planner-by-date-range.component.scss'],
})
export class PlannerByDateRangeComponent implements OnInit {
  Tabs = Tabs;

  tabs = [
    { link: 'planning', name: 'Планування' },
    { link: 'shopping', name: 'Список покупок' },
    { link: 'preps', name: 'Попереднє приготування' },
  ];
  activeLink = this.tabs[0].link;
  constructor() {}

  ngOnInit() {}
}
