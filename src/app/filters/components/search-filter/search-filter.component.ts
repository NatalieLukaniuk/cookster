import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
})
export class SearchFilterComponent implements OnInit {
  @Output() enteredValue: EventEmitter<string> = new EventEmitter();

  isInput: boolean = false;

  emittedValue: string = '';

  constructor() {}

  ngOnInit() {}

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.isInput = !!filterValue.length;
    if (filterValue !== this.emittedValue) {
      this.enteredValue.emit(filterValue);
      this.emittedValue = filterValue;
    }
  }

  @ViewChild('search') search: ElementRef | undefined;

  clear() {
    if (this.search) {
      this.search.nativeElement.value = '';
      this.isInput = false;
      this.enteredValue.emit('');
      this.emittedValue = '';
    }
  }
}
