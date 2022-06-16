import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipy } from 'src/app/recipies/models/recipy.interface';

@Component({
  selector: 'app-calendar-recipy',
  templateUrl: './calendar-recipy.component.html',
  styleUrls: ['./calendar-recipy.component.scss']
})
export class CalendarRecipyComponent implements OnInit {

  @Input() isMobile: boolean = false;
  @Input() recipy!: Recipy;

  @Output() removeRecipy = new EventEmitter<Recipy>()

  constructor(private router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
  }
  viewRecipy() {
    this.router.navigate(['cookster', 'recipies', 'full-recipy', this.recipy.id], {
      relativeTo: this.route.parent,
    });
  }

  onRemoveRecipy(){
    this.removeRecipy.emit(this.recipy)
  }
}
