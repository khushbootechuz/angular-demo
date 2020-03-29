import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
const users = [{
    id: 1,
    username: 'ishver',
    firstName: 'Ishver',
    lastName: 'nayak',
    password: 'ishver@123',
    email: 'ishver@gmail.com'
}];

let Products = JSON.parse(localStorage.getItem('products')) || [];
let Cart = JSON.parse(localStorage.getItem('cart')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body, urlWithParams } = request;
        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/product') && method === 'POST':
                    return addProduct();
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/product/list') && method === 'POST':
                    return getProducts();
                case url.endsWith('/cart') && method === 'POST':
                    return addProductToCart();
                case url.endsWith('/cart') && method === 'GET':
                    return getCartProducts();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.email === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'user-toekn'
            })
        }

        function addProduct() {
            const item = body

            if (Products.find(x => x.productName === item.productName)) {
                return error('ProductName "' + item.productName + '" is already taken')
            }

            item.id = Products.length ? Math.max(...Products.map(x => x.productId)) + 1 : 1;
            Products.push(item);
            localStorage.setItem('products', JSON.stringify(Products));

            return ok();
        }

        function getProducts() {
            if (!isLoggedIn()) return unauthorized();
            if(body.searchKey) {
                let searchText = body.searchKey.toLowerCase();
                return ok(Products.filter( it => {
                  return it.productName.toLowerCase().startsWith(searchText);
                }))
            } else {
                return ok(Products);
            }
        }

        function addProductToCart() {
            const product = body.data;

            if (Cart.find(x => x.productName === product.productName)) {
                return error('Produc is already in cart')
            }
            product.id = Cart.length ? Math.max(...Cart.map(x => x.id)) + 1 : 1;
            Cart.push(product);
            localStorage.setItem('cart', JSON.stringify(Cart));
            return ok()
        }

        function getCartProducts() {
            if (!isLoggedIn()) return unauthorized();
                return ok(Cart);
        }
        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer user-toekn';
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};