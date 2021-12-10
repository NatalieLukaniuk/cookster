import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
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
  }
}
