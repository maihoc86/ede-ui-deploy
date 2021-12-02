import { LoadProductFilterComponent } from './load-product-filter/load-product-filter.component';
import { UserChangPassComponent } from './user-change-pass/user-chang-pass.component';
import { UserOderComponent } from './user-oder/user-oder.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountActiveComponent } from './account-active/account-active.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { ProductShopComponent } from './product-shop/product-shop.component';
import { RegisterAccountComponent } from './register-account/register-account.component';
import { ProductAllComponent } from './product-all/product-all.component';
import { OrderAllComponent } from './order-all/order-all.component';
import { ShopInterfaceComponent } from './shop-interface/shop-interface.component';
import { ShowAllProductsShopInterfaceComponent } from './show-all-products-shop-interface/show-all-products-shop-interface.component';
import { ShopProfileComponent } from './shop-profile/shop-profile.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { RevenueShopComponent } from './revenue-shop/revenue-shop.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CategoryShopComponent } from './category-shop/category-shop.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { UserUpdateEmailComponent } from './user-update-email/user-update-email.component';
import { UserAddressComponent } from './user-address/user-address.component';
import { ContactComponent } from './contact/contact.component';
import { PaymentShopComponent } from './payment-shop/payment-shop.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterAccountComponent },
  { path: 'account/verify', component: AccountActiveComponent },
  { path: 'shop/product/manager', component: ProductShopComponent },
  { path: 'shop/payment', component: PaymentShopComponent },
  { path: 'shop/product/all', component: ProductAllComponent },
  { path: 'shop/order/all', component: OrderAllComponent },
  { path: 'shop/interface/:id', component: ShopInterfaceComponent },
  {
    path: 'shop/showall/interface',
    component: ShowAllProductsShopInterfaceComponent,
  },
  { path: 'shop/profile', component: ShopProfileComponent },
  {
    path: 'shop/product/manager/:id',
    component: ProductShopComponent,
    pathMatch: 'full',
  },
  { path: 'search', component: ProductSearchComponent },
  { path: 'shop/revenue', component: RevenueShopComponent },
  { path: 'product/detail/:idProduct', component: ProductDetailComponent },
  { path: 'shop/category', component: CategoryShopComponent },
  { path: 'shopping/cart', component: ShoppingCartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'user/account', component: UserAccountComponent },
  { path: 'user/update/email', component: UserUpdateEmailComponent },
  { path: 'user/order', component: UserOderComponent },
  { path: 'user/change/pass', component: UserChangPassComponent },
  { path: 'user/account/address', component: UserAddressComponent },
  { path: 'load/product/filter/:param', component: LoadProductFilterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
