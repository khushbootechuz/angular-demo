import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  prodcuts = new BehaviorSubject([]);

  constructor(private router: Router, 
    private service: ProductService, 
    public toastr: ToastrService,
    public loaderService: LoaderService) { }

  ngOnInit(): void {
  }

  addProduct(name, price) {
    this.loaderService.startLoading();
    this.service.addProduct(name, price)
    .pipe(first())
    .subscribe(
      res => {
        this.loaderService.stopLoading();
        this.prodcuts.next([{"productName": name,"productPrice":price}]);
        this.router.navigate(['product/list']);
        this.toastr.success("Product Added Successfully");
        },
        error => {
            this.toastr.error(error.error.message);
            this.loaderService.stopLoading();
        });
  } 

}
