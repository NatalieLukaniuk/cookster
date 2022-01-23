import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';


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
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
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

  activePath: string = 'users';
  constructor() { 
    const TREE_DATA: NavigationNode[] = [
      { name: 'Users', path: `users` },
      { name: 'Logs', path: 'logs' },
    ];

    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {
  }

}
