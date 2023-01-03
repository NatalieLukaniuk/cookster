import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/recipies/models/products.interface';
import { Recipy } from 'src/app/recipies/models/recipy.interface';

@Component({
  selector: 'app-update-products',
  templateUrl: './update-products.component.html',
  styleUrls: ['./update-products.component.scss']
})
export class UpdateProductsComponent implements OnInit {
  @Input()
  products!: Product[];
  @Input()
  recipies!: Recipy[];
  ngOnInit(): void {
    
  }
  
}
