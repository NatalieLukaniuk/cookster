import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Product } from '../recipies/models/products.interface';
import { Recipy } from '../recipies/models/recipy.interface';
import { RecipiesService } from '../recipies/services/recipies.service';
import { getAllRecipies } from '../store/selectors/recipies.selectors';

interface NavigationNode {
  name: string;
  path: string;
  children?: NavigationNode[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  path: string;
  level: number;
}

function nodeTransformer(node: NavigationNode, level: number) {
  return {
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    path: node.path,
    level: level,
  };
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    nodeTransformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  activePath: string = 'recipies';

  recipies: Recipy[] = [];
  products: Product[] = [];

  destroyed$ = new Subject();

  constructor(private recipiesService: RecipiesService, private store: Store) {
    const TREE_DATA: NavigationNode[] = [
      { name: 'Recipies', path: `recipies` },
      { name: 'Products', path: 'products' },
      { name: 'Update Products', path: 'update-products' },
    ];

    this.dataSource.data = TREE_DATA;
  }
  ngOnDestroy(): void {
    this.destroyed$.complete()
  }

  ngOnInit() {
    this.store.pipe(select(getAllRecipies), takeUntil(this.destroyed$)).subscribe(res => this.recipies = res)
    this.recipiesService.products$.subscribe((products: Product[]) => {
      this.products = products;
    })
  }
}
