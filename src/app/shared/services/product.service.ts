import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './../models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public addProduct(name, price) {
    return this.http.post<any>(`/product`, {"productName": name,"productPrice":price})
    .pipe(map(user => {
        return user;
    }));
  }

  public getProduct(searchKey) {
    return this.http.post<any>(`/product/list`, {"searchKey": searchKey})
    .pipe(map(product => {
        return product;
    }));
  }

  public addProductToCart(data) {
    return this.http.post<any>(`/cart`, {"data": data})
    .pipe(map(product => {
        return product;
    }));
  }

  public getCartProduct() {
    return this.http.get<any>(`/cart`)
    .pipe(map(product => {
        return product;
    }));
  }
}
