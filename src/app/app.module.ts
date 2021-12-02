import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { RegisterAccountComponent } from './register-account/register-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AccountActiveComponent } from './account-active/account-active.component';
import { ProductShopComponent } from './product-shop/product-shop.component';
import { AsideShopComponent } from './layout/aside-shop/aside-shop.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { ProductAllComponent } from './product-all/product-all.component';
import { OrderAllComponent } from './order-all/order-all.component';
import { ShopInterfaceComponent } from './shop-interface/shop-interface.component';
import { ShowAllProductsShopInterfaceComponent } from './show-all-products-shop-interface/show-all-products-shop-interface.component';
import { ShopProfileComponent } from './shop-profile/shop-profile.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProductSearchElementComponent } from './items/product-search-element/product-search-element.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RevenueShopComponent } from './revenue-shop/revenue-shop.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CategoryShopComponent } from './category-shop/category-shop.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { NgxLoadingModule } from 'ngx-loading';
import { UserAccountComponent } from './user-account/user-account.component';
import { AsideUserComponent } from './layout/aside-user/aside-user.component';
import { UserUpdateEmailComponent } from './user-update-email/user-update-email.component';
import { UserOderComponent } from './user-oder/user-oder.component';
import { UserChangPassComponent } from './user-change-pass/user-chang-pass.component';
import { UserAddressComponent } from './user-address/user-address.component';
import { ContactComponent } from './contact/contact.component';
import { PaymentShopComponent } from './payment-shop/payment-shop.component';
import { LoadProductFilterComponent } from './load-product-filter/load-product-filter.component';
// import { UserCheckoutCartComponent } from './user-checkout-cart/user-checkout-cart.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    IndexComponent,
    LoginComponent,
    RegisterAccountComponent,
    ForgotPasswordComponent,
    AccountActiveComponent,
    ProductShopComponent,
    AsideShopComponent,
    ProductAllComponent,
    OrderAllComponent,
    ShopInterfaceComponent,
    ShowAllProductsShopInterfaceComponent,
    ShopProfileComponent,
    ProductSearchElementComponent,
    ProductSearchComponent,
    RevenueShopComponent,
    ProductDetailComponent,
    CategoryShopComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    UserAccountComponent,
    AsideUserComponent,
    UserUpdateEmailComponent,
    UserOderComponent,
    UserChangPassComponent,
    UserAddressComponent,
    ContactComponent,
    PaymentShopComponent,
    LoadProductFilterComponent,
    // UserCheckoutCartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatDatepickerModule,
    NgxPaginationModule,
    MatProgressBarModule,
    NgxLoadingModule.forRoot({})
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
