import { Component, Input, OnInit } from '@angular/core';
import { Recipy } from 'src/app/recipies/models/recipy.interface';

@Component({
  selector: 'app-calendar-recipy',
  templateUrl: './calendar-recipy.component.html',
  styleUrls: ['./calendar-recipy.component.scss']
})
export class CalendarRecipyComponent implements OnInit {

  @Input() isMobile: boolean = false;
  @Input() recipy!: Recipy;

  constructor() { }

  ngOnInit(): void {
  }

}
