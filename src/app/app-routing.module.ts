import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginAuthGuard, AuthGuard } from './shared/auth/auth-guard.service';
import { ProductModule} from './product/product.module';
import { LayoutComponent } from './layout/layout.component';
import { CartModule} from './cart/cart.module';

const routes: Routes = [{
  path: '',
  redirectTo: 'login',
  pathMatch: 'full',
},
{ path: 'login', component: LoginComponent, canActivate:[LoginAuthGuard]},
{ 
  path: '', 
  component: LayoutComponent,
  children: [
    {
      path: 'product',
      loadChildren: () => ProductModule,
      canActivate: [AuthGuard]
    },
    {
      path: 'cart',
      loadChildren: () => CartModule,
      canActivate: [AuthGuard]
    }
  ],
},
{
  path: "**",
  redirectTo: "login",
},];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes, {
    // initialNavigation: 'enabled'
    // })
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
