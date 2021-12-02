import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Shop } from '../../models/shop.model';
@Injectable({
  providedIn: 'root',
})
export class MyShopService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.cookieService.get('auth'),
    }),
  };
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  private REST_API_SERVER = 'http://localhost:8080/ede-customer/shop';
  private REST_API_SERVER2 = 'http://localhost:8080/ede-product/';
  public updateInfoShop(data: Shop) {
    return this.httpClient.put<any>(
      this.REST_API_SERVER + '/user/info/update/',
      data,
      this.httpOptions
    );
  }

  /**
   * Hàm lấy ra thông tin shop theo ID
   */
  public getShopInfo(idShop: any) {
    return this.httpClient.get<any>(
      this.REST_API_SERVER + '/view/info/' + idShop,
      this.httpOptions
    );
  }
  public get5ProductNew(id: any) {
    return this.httpClient.get<any>(
      this.REST_API_SERVER2 + 'view/5productnew/byshop/' + id
    );
  }
  public get5ProductDiscount(id: any) {
    return this.httpClient.get<any>(
      this.REST_API_SERVER2 + 'view/5productdiscount/byshop/' + id
    );
  }
  public get5ProductSalling(id: any) {
    return this.httpClient.get<any>(
      this.REST_API_SERVER2 + 'view/5productsalling/byshop/' + id
    );
  }
  public getProductSale(id: any, p: any, keySearch: any) {
    return this.httpClient.get<any>(
      this.REST_API_SERVER2 +
        'view/productsale/byshop/' +
        id +
        '?page=' +
        p +
        '&keySearch=' +
        keySearch
    );
  }
  public getProductNew(id: any, p: any, keySearch: any) {
    return this.httpClient.get<any>(
      this.REST_API_SERVER2 +
        'view/productnew/byshop/' +
        id +
        '?page=' +
        p +
        '&keySearch=' +
        keySearch
    );
  }
  public getProductSalling(id: any, p: any, keySearch: any) {
    return this.httpClient.get<any>(
      this.REST_API_SERVER2 +
        'view/productsalling/byshop/' +
        id +
        '?page=' +
        p +
        '&keySearch=' +
        keySearch
    );
  }
}
