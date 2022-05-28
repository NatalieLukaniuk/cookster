import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DishType } from 'src/app/recipies/models/dishType.enum';

export class chip {
  id: DishType;
  selected: boolean;
  constructor(id: number) {
    this.id = id;
    this.selected = false
  }
}
@Component({
  selector: 'app-add-tags',
  templateUrl: './add-tags.component.html',
  styleUrls: ['./add-tags.component.scss']
})
export class AddTagsComponent implements OnInit {
  chips: chip[] = [];
  @Input() tags!: DishType[]
  @Output() selectedTags = new EventEmitter<DishType[]>()


  constructor() {

  }

  ngOnInit(): void {
    this.chips = this.tags.map(tag => new chip(tag))
  }

  getTagsText(tag: DishType) {
    return DishType[tag];
  }
  onChange(tag: chip) {
    tag.selected = !tag.selected;
    let selectedTags = this.chips.filter(chip => chip.selected).map(chip => chip.id)
    this.selectedTags.emit(selectedTags)
  }
}
