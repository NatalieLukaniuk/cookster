import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs/operators';
import { AddProductComponent } from 'src/app/recipies/components/add-product/add-product.component';
import { MeasuringUnitText } from 'src/app/recipies/models/measuring-units.enum';
import { Product, ProductTypeText } from 'src/app/recipies/models/products.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.scss'],
})
export class ProductsAdminComponent implements OnInit, OnChanges {
  @Input()
  products!: Product[];

  displayedColumns: string[] = [
    'name',
    'density',
    'grInOneItem',
    'calories',
    'defaultUnit',
    'type',
    'actions',
  ];
  dataSource!: MatTableDataSource<Product>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(public dialog: MatDialog, private recipiesService: RecipiesService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.initTable();
  }

  ngOnInit() {
    this.initTable();
  }

  initTable(): void {
    this.dataSource = new MatTableDataSource<Product>(this.products);
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

  addProduct(){
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      position: { bottom: '0' },
      hasBackdrop: false,
      panelClass: 'full-recipy-dialog',
      autoFocus: false,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: Product) => {
        if(result){
          this.recipiesService.processAddNewProduct(result);
        }
        
      });
  }

  editProduct(product: Product){

  }

  deleteProduct(product: Product){
    this.recipiesService.deleteProduct(product)
  }

  getProductTypeText(type: string) {
    let typeNumber = +type;
    return ProductTypeText[typeNumber];
  }
  
  getMeasuringUnitText(unit: any) {
    return MeasuringUnitText[unit];
  }
}
