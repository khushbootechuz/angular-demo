import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {

  @Input() data: Observable<any>;
  productList:any = [];
  searchKey:any;

  constructor(private cd: ChangeDetectorRef,
     private service: ProductService, 
     public toastr: ToastrService,
     public loaderService: LoaderService ) { }

  ngOnInit(): void {
    this.getProductList();
    if(this.data) {
      this.data.subscribe(item => {
        this.productList = [...this.productList, ...item];
      });
    }
  }

  getProductList() {
    this.service.getProduct(this.searchKey)
    .pipe(first())
    .subscribe(
        res => {
          this.productList = res;
        },
        error => {
            this.toastr.error(error.error.message);
        });
  }

  addToCart(product) {
    this.loaderService.startLoading();
    this.service.addProductToCart(product)
    .pipe(first())
    .subscribe(
        res => {
          this.loaderService.stopLoading();
        },
        error => {
            this.toastr.error(error.error.message);
            this.loaderService.stopLoading();
        });    
  }

}
