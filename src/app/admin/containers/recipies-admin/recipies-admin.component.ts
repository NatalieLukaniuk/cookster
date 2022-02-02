import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AddRecipyComponent } from 'src/app/recipies/components/add-recipy/add-recipy.component';
import { Recipy } from 'src/app/recipies/models/recipy.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';

@Component({
  selector: 'app-recipies-admin',
  templateUrl: './recipies-admin.component.html',
  styleUrls: ['./recipies-admin.component.scss']
})
export class RecipiesAdminComponent implements OnInit {
  @Input()
  recipies!: Recipy[];

  displayedColumns: string[] = [
    'name',
    'complexity',
    'type',
    'author',
    'createdOn',
    'editedBy',
    'lastEdited',
    'actions'
  ];


  dataSource!: MatTableDataSource<Recipy>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(public dialog: MatDialog, private recipiesService: RecipiesService, private router: Router, private route: ActivatedRoute,) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.initTable();
  }

  ngOnInit() {
    this.initTable();
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

  addRecipy(){
    const dialogRef = this.dialog.open(AddRecipyComponent, {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      position: { bottom: '0' },
      hasBackdrop: false,
      panelClass: 'full-recipy-dialog',
      autoFocus: false,
      data: {
        mode: 'create'
      }
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: Recipy) => {
        this.recipiesService.processAddNewRecipy(result);
      });
  }

  openRecipy(recipy: Recipy){
    this.router.navigate(['cookster/recipies/full-recipy/', recipy.id], {
      relativeTo: this.route.parent,
    });
  }

  editRecipy(recipy: Recipy){
    const dialogRef = this.dialog.open(AddRecipyComponent, {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      position: { bottom: '0' },
      hasBackdrop: false,
      panelClass: 'full-recipy-dialog',
      autoFocus: false,
      data: {
        mode: 'edit',
        recipy: recipy
      }
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: Recipy) => {
        if(result?.id){
          this.recipiesService.editRecipy(result.id, result);
        }        
      });
  }

  deleteRecipy(recipy: Recipy){
    this.recipiesService.deleteRecipy(recipy)
  }

}
