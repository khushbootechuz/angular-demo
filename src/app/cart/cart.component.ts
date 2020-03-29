import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../shared/services/loader.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  productList:any = [];

  constructor(private service: ProductService, 
    public toastr: ToastrService,
    public loaderService: LoaderService ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.loaderService.startLoading();
    this.service.getCartProduct()
    .pipe(first())
    .subscribe(
        res => {
          this.productList = res;
          this.loaderService.stopLoading();
        },
        error => {
            this.toastr.error(error.error.message);
            this.loaderService.stopLoading();
        });
  }

}
