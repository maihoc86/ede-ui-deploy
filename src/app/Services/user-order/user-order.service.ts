import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserOrderService {
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

  private API_SERVER = 'http://localhost:8080/ede-order';
  public getAllOrderUser(id: string) {
    return this.httpClient.get<any>(
      this.API_SERVER + '/view/order/user/' + id,
      this.httpOptions
    );
  }

  getAllDiscountOrderSystem() {
    return this.httpClient.get(
      `${this.API_SERVER}/view/all/discount/order`,
      this.httpOptions
    );
  }

  checkOrderDiscount(orderId: any) {
    return this.httpClient.get(
      `${this.API_SERVER}/check/discount/order?idDiscount=` + orderId,
      this.httpOptions
    );
  }

  cancelOrder(order: any) {
    return this.httpClient.put<any>(
      `${this.API_SERVER}/user/cancel/order`,
      order,
      this.httpOptions
    );
  }

  submitDanhGia(value: any) {
    return this.httpClient.post<any>(
      `${this.API_SERVER}/user/evaluate/order`,
      value,
      this.httpOptions
    );
  }

  addEvaluateImage(value: any) {
    return this.httpClient.post<any>(
      `${this.API_SERVER}/user/evaluate/order/image`,
      value,
      this.httpOptions
    );
  }
}
