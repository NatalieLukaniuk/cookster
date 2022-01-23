import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { ProductsService } from './recipies/services/products.service';
import { RecipiesService } from './recipies/services/recipies.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private recipiesService: RecipiesService,
    private productsService: ProductsService) {
    this.iconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/cross.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'menu',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/dots-3.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'heart',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/heart.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'add',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/plus.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'arrow-left',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/arrow-left.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'done',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/checkmark.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'search-small',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/search.svg'
      )
    );
  }
  ngOnInit(): void {
    this.recipiesService.getRecipies();
    this.productsService.getAllProducts();
    this.productsService.productsUpdated$.subscribe(() => this.productsService.getAllProducts())
  }
}
