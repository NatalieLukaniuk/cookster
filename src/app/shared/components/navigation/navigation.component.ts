import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
navigation = [
  {path: 'extended-search', name: 'Розширений пошук'},
  {path: 'user-recipies', name: 'Мої рецепти'},
  {path: 'friends-feed', name: 'Стрічка друзів'},
  {path: 'shopping-list', name: 'Список покупок'},
  {path: 'user-menus', name: 'Мої меню'}
];
}
