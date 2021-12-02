import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class OrderShopService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.cookieService.get('auth'),
    }),
  };

  private REST_API_SERVER = 'http://localhost:8080/ede-order';

  public getOrderShop(
    keyword: string,
    status: string,
    page: number,
    size: number
  ) {
    return this.httpClient.get<any>(
      this.REST_API_SERVER +
        '/view/order/shop/getAll?keyword=' +
        keyword +
        '&page=' +
        page +
        '&size=' +
        size +
        '&status=' +
        status,
      this.httpOptions
    );
  }
  public getOrderDetailShop(
    id: string,
    keyword: string,
    page: number,
    size: number
  ) {
    return this.httpClient.get<any>(
      this.REST_API_SERVER +
        '/view/orderDetail/shop/getAll/' +
        id +
        '?keyword=' +
        keyword +
        '&page=' +
        page +
        '&size=' +
        size,
      this.httpOptions
    );
  }
  public getListOrderShop() {
    return this.httpClient.get<any>(
      this.REST_API_SERVER + '/view/order/shop/listAll',
      this.httpOptions
    );
  }

  public acceptOrder(body: any) {
    return this.httpClient.put<any>(
      this.REST_API_SERVER + '/shop/accept/order/',
      body,
      this.httpOptions
    );
  }

  public cancelOrder(body: any) {
    return this.httpClient.put<any>(
      this.REST_API_SERVER + '/shop/cancel/order/',
      body,
      this.httpOptions
    );
  }

  public getDanhGiaOrder(id: any) {
    return this.httpClient.get<any>(
      this.REST_API_SERVER + '/shop/view/evaluate/order/' + id,
      this.httpOptions
    );
  }

  getEvaluateImage(idEvaluate: any) {
    return this.httpClient.get<any>(
      this.REST_API_SERVER + '/shop/view/evaluate/order/image/' + idEvaluate,
      this.httpOptions
    );
  }
}
