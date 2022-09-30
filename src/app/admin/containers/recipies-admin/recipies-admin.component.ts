import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Recipy } from 'src/app/recipies/models/recipy.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';

import * as RecipyActions from '../../../store/actions/recipies.actions';

@Component({
  selector: 'app-recipies-admin',
  templateUrl: './recipies-admin.component.html',
  styleUrls: ['./recipies-admin.component.scss'],
})
export class RecipiesAdminComponent implements OnInit {
  @Input()
  recipies!: Recipy[];

  displayedColumns: string[] = [];

  allColumns = [
    { name: 'name', displayed: true, selectDisabled: true },
    { name: 'complexity', displayed: true, selectDisabled: false },
    { name: 'type', displayed: true, selectDisabled: false },
    { name: 'author', displayed: false, selectDisabled: false },
    { name: 'createdOn', displayed: true, selectDisabled: false },
    { name: 'editedBy', displayed: false, selectDisabled: false },
    { name: 'lastEdited', displayed: false, selectDisabled: false },
    { name: 'isClone', displayed: false, selectDisabled: false },
    { name: 'isCheckedAndApproved', displayed: true, selectDisabled: false },
    { name: 'actions', displayed: true, selectDisabled: true },
  ];

  dataSource!: MatTableDataSource<Recipy>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private recipiesService: RecipiesService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.initTable();
  }

  ngOnInit() {
    this.initTable();
    this.displayedColumns = this.allColumns
      .filter((column) => column.displayed)
      .map((column) => column.name);
  }

  initTable(): void {
    this.dataSource = new MatTableDataSource<Recipy>(this.recipies);
    this.initSortAndPagination();
  }

  initSortAndPagination(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addRecipy() {
    this.router.navigate(['recipies', 'edit-recipy'], {
      relativeTo: this.route,
    });
  }

  openRecipy(recipy: Recipy) {
    this.router.navigate(['cookster/recipies/full-recipy/', recipy.id], {
      relativeTo: this.route.parent,
    });
  }

  deleteRecipy(recipy: Recipy) {
    this.recipiesService.deleteRecipy(recipy);
  }

  getAuthor(recipy: Recipy) {
    return this.recipiesService.getRecipyBelongsTo(recipy);
  }

  getCreatedOn(recipy: Recipy) {
    return this.recipiesService.getRecipyCreatedOn(recipy);
  }

  getIsClone(recipy: Recipy): boolean {
    return Boolean(recipy.clonedBy);
  }

  getIsIngredientNotInDB(recipy: Recipy): boolean {
    return !!recipy.notApproved;
  }

  onselectionChange(event: any) {
    console.log(this.displayedColumns);
  }
  onisCheckedAndApprovedClicked(recipy: Recipy) {
    let updatedRecipy: Recipy = {
      ...recipy,
      isCheckedAndApproved: !recipy.isCheckedAndApproved,
    };
    this.store.dispatch(new RecipyActions.UpdateRecipyAction(updatedRecipy));
  }

  updateRecipies() {
    this.recursiveUpdate(0);
  }
  recursiveUpdate(i: number) {
    if (i < this.recipies.length - 1) {
      setTimeout(() => {
        if (!this.recipies[i].calorificValue) {
          this.store.dispatch(
            new RecipyActions.UpdateRecipyAction(this.recipies[i])
          );
        }
        i++;
        this.recursiveUpdate(i);
      }, 1000);
    }
  }
}
