import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-planner-landing',
  templateUrl: './planner-landing.component.html',
  styleUrls: ['./planner-landing.component.scss']
})
export class PlannerLandingComponent implements OnInit {

  isListView: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
